const path = require('path');

/** @type {import('next').NextConfig} */
const isUnblock = process.env.CI_UNBLOCK === 'true';

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'a.espncdn.com' },
      { protocol: 'https', hostname: 'espn.com' },
      { protocol: 'https', hostname: 'static.www.nfl.com' },
      { protocol: 'https', hostname: '*.cloudfront.net' },
    ],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      dns: false,
      net: false,
      tls: false,
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: isUnblock,
  },
  typescript: {
    ignoreBuildErrors: isUnblock,
  },
};

module.exports = nextConfig;

