/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  globalSetup: "./tests/globalSetup.js",
  setupFiles: ["./tests/setup.js"],
  modulePathIgnorePatterns: ["<rootDir>/deploy/"],
  maxWorkers: 1,
  testTimeout: 30000,
  forceExit: true,
  verbose: true,
};
