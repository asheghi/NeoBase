module.exports = {
  globals: {
    "ts-jest": {
      tsconfigFile: "tsconfig.json",
    },
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/src/test/**/*.test.(ts|js)"],
  testEnvironment: "node",
  verbose: false,
  silent: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  setupFiles: ["./src/test/__setup/index.ts"],
};
