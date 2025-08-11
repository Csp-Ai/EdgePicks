import nextJest from "next/jest.js";
const createJestConfig = nextJest({ dir: "./" });

const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Make sure transforms don’t choke on ESM packages we use:
  transformIgnorePatterns: [
    "/node_modules/(?!(nanoid|ky|nanoid-dictionary|lucide-react|uuid|date-fns|d3|@react-leaflet|leaflet|sonner)/)"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(svg)$": "<rootDir>/__mocks__/svgMock.ts"
  },
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}"
  ],
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)"]
};

export default createJestConfig(config);
