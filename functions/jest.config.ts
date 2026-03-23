import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.spec.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/index.ts", "!src/app.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  moduleNameMapper: {
    "^firebase-functions$": "<rootDir>/tests/__mocks__/firebase-functions.ts",
    "^firebase-admin$": "<rootDir>/tests/__mocks__/firebase-admin.ts"
  }
};

export default config;
