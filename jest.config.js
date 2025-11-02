dmodule.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'app.js',
    '!node_modules/**'
  ],
  setupFilesAfterEnv: [],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  testPathIgnorePatterns: [
    '/node_modules/'
  ]
};
