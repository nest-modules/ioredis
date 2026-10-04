module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'lib',
  testRegex: '/__tests__/.*\\.spec\\.(ts|js)$',
  preset: 'ts-jest',
  collectCoverageFrom: ['**/*.ts', '!__tests__/**', '!interfaces/**'],
  coverageDirectory: '../coverage',
  coverageThreshold: {
    global: { branches: 100, functions: 100, lines: 100, statements: 100 },
  },
};
