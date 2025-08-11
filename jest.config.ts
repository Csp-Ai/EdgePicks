import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: any = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { tsconfig: "<rootDir>/tsconfig.jest.json", isolatedModules: true }
    ],
  },
  transformIgnorePatterns: [
    // Allow transforming ESM packages that Jest chokes on
    "/node_modules/(?!(@?react-leaflet|leaflet|d3-|d3|tslib|nanoid|uuid|@radix-ui|lucide-react|framer-motion)/)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/dist/"],
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
  ],
};

export default createJestConfig(config);
