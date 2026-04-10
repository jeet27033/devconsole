const appConfig = require("../../app-config");
const sanitizeAppName = require("../webpack/utils/sanitizeAppName");

module.exports = {
  rootDir: '../../',
  verbose: true,
  moduleFileExtensions: ['js'],
  testURL: 'http://localhost/',
  setupFiles: [
    '<rootDir>/internals/testing/env.js',
    '<rootDir>/internals/testing/setup.js',
  ],
  clearMocks: true,
  resetMocks: true,
  globals: {
    NODE_ENV: 'test',
    CURRENT_APP_NAME: sanitizeAppName(appConfig.appName),
  },
  transformIgnorePatterns: [],
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'app'],
  testPathIgnorePatterns: [],
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverage: true,
  coverageDirectory: '<rootDir>/reports/coverage/integration',
  collectCoverageFrom: [
    '**/app/components/**/*.js',
    '!**/app/**/initialState.js',
    '!**/app/**/constants.js',
    '!**/app/**/Loadable.js',
    '!**/app/**/index.js',
    '!**/app/**/mocks/*.js',
    '!**/app/**/*.schema.js',
    '!**/app/**/*.config.js',
    '!**/app/**/*.style.js',
    '!**/app/**/style.js',
    '!**/app/**/*.stories.js',
    '!**/app/**/messages.js',
    '!**/app/**/*.snap',
    '!**/app/**/config/*.js',
  ],
  coveragePathIgnorePatterns: [
    '.integration.test.',
    '.mockdata.',
    '.mockData.',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|avif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|csv)$':
      '<rootDir>/internals/testing/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/internals/testing/assetsTransformer.js',
    '^redux-saga(.*)$': '<rootDir>/node_modules/redux-saga$1',
    '^@capillarytech/cap-ui-utils(.*)$':
      '<rootDir>/node_modules/@capillarytech/cap-ui-utils$1',
  },
  coverageReporters: ['lcov', 'json', 'text', 'text-summary'],
  testRegex: ['.integration.test.js'], //file consists of .integration.test.js, constants
};
