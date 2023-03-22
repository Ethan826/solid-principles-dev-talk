/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["@relmify/jest-fp-ts"],
  testEnvironment: "node",
};
