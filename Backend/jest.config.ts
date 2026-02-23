import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  globalTeardown: "<rootDir>/tests/teardown.ts",

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
};

export default config;
