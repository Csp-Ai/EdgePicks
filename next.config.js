const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const isUnblock = process.env.CI_UNBLOCK === 'true';

/** @type {import('next').NextConfig} */
const base = {
  output: process.env.STANDALONE === 'true' ? 'standalone' : undefined,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'a.espncdn.com' },
      { protocol: 'https', hostname: 'espn.com' },
      { protocol: 'https', hostname: 'static.www.nfl.com' },
      { protocol: 'https', hostname: '*.cloudfront.net' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  transpilePackages: ['ioredis', '@upstash/redis'],
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname);

    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      dns: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      fs: false,
      path: false,
    };

    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 240000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|next|@next)[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'commons',
              priority: 30,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /@supabase\/realtime-js\/dist\/module\/lib\/websocket-factory\.js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "script-src 'self';" },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: isUnblock,
  },
  typescript: {
    ignoreBuildErrors: isUnblock,
  },
  experimental: {
    ...(process.env.EXP_DISABLE_TURBOPACK ? {} : {}),
  },
  modularizeImports: {
    'lodash-es': { transform: 'lodash-es/{{member}}' },
    'date-fns': { transform: 'date-fns/{{member}}' },
    'lucide-react': { transform: 'lucide-react/dist/esm/icons/{{member}}' },
  },
};

module.exports = withBundleAnalyzer(base);
