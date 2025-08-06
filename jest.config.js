const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/scripts/update-llms-log.test.js',
    '<rootDir>/lib/logUiEvent.test.js',
  ],
};

module.exports = createJestConfig(customJestConfig);
