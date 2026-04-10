const appConfig = require("../../app-config");
const sanitizeAppName = require("../webpack/utils/sanitizeAppName");

module.exports = {
  rootDir: '../../',
  roots: ['<rootDir>/app/'],
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
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'app'],
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverage: true,
  coverageDirectory: '<rootDir>/reports/coverage/unit',
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
    '!**/app/**/actions.js',
    '!**/app/**/*.stories.js',
    '!**/app/**/messages.js',
    '!**/app/**/*.snap',
    '!**/app/**/config/*.js',
  ],
  moduleNameMapper: {
    '^components(.*)$': '<rootDir>/app/components/$1',
    '^utils(.*)$': '<rootDir>/app/utils/$1',
    '\\.(jpg|jpeg|png|gif|avif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/internals/testing/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/internals/testing/assetsTransformer.js',
  },
  coverageReporters: ['lcov', 'json', 'text', 'text-summary'],
  transformIgnorePatterns: [
    'node_modules/(?!(@capillarytech|antd|rc-pagination|rc-calendar|lodash-es|@bugsnag|ml-matrix)/)',
  ],
  coveragePathIgnorePatterns: [
    '.integration.test.',
    '.mockdata.',
    '.mockData.',
  ],
  testPathIgnorePatterns: ['.integration.(test|spec).(js|jsx|ts|tsx)'],
  testRegex: 'tests/.*\\.test\\.js$',
};
