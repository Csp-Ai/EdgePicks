import nextJest from "next/jest.js";
const createJestConfig = nextJest({ dir: "./" });

const config: any = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(svg)$": "<rootDir>/__mocks__/svgMock.ts",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { tsconfig: "<rootDir>/tsconfig.jest.json", isolatedModules: true }
    ]
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@?react-leaflet|leaflet|d3|d3-|lodash-es|uuid|nanoid|tslib|@radix-ui|lucide-react|framer-motion)/)"
  ],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/dist/"],
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts"
  ]
};

export default createJestConfig(config);
