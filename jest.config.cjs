module.exports = {
  testEnvironment: "node",
  testTimeout: 30000, // allow time for in-memory mongo
  setupFiles: ["<rootDir>/tests/setup/jest.setup.js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  roots: ["<rootDir>/tests"],
};
