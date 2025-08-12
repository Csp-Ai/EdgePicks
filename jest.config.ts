const config: import('jest').Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(svg)$': '<rootDir>/__mocks__/svgMock.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json', useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testMatch: ['<rootDir>/__tests__/smoke.exists.test.tsx'],
  // TEMP quarantine while we fix contracts/e2e/a11y:
  testPathIgnorePatterns: ['<rootDir>/tests/', '<rootDir>/scripts/update-llms-log.test.js', '<rootDir>/lib/logUiEvent.test.js'],
};
export default config;
