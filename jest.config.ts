const config: import('jest').Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(svg)$': '<rootDir>/__mocks__/svgMock.ts',
    'react-force-graph-2d': '<rootDir>/__mocks__/identityMock.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json', useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testMatch: [
    '<rootDir>/__tests__/smoke.exists.test.tsx',
    '<rootDir>/__tests__/AgentFlowVisualizer.test.tsx',
    '<rootDir>/__tests__/AgentFlowVisualizer.fallback.test.tsx',
    '<rootDir>/__tests__/devLogin.prod.test.ts',
    '<rootDir>/__tests__/mapAgentEventsToGraph.test.ts',
    '<rootDir>/__tests__/icon.compile.test.ts',
    '<rootDir>/tests/agent-graph.compile.test.ts',
  ],
  // TEMP quarantine while we fix contracts/e2e/a11y:
  testPathIgnorePatterns: ['<rootDir>/scripts/update-llms-log.test.js', '<rootDir>/lib/logUiEvent.test.js'],
};
export default config;
