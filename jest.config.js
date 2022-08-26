module.exports = {
  globals: {
    "ts-jest": {
      tsconfigFile: "tsconfig.json",
    },
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "./node_modules/ts-jest/preprocessor.js",
  },
  testMatch: ["**/src/test/**/*.test.(ts|js)"],
  testEnvironment: "node",
  verbose: false,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
