import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const presetConfig = createDefaultEsmPreset({});

export default {
  ...presetConfig,

  testEnvironment: "node",

  testMatch: ["**/tests/**/*.test.ts"],

  globalSetup: "<rootDir>/tests/globalSetup.ts",
  globalTeardown: "<rootDir>/tests/globalTeardown.ts",

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  moduleDirectories: ["node_modules", "<rootDir>"],

  testTimeout: 30000,

  // Each test FILE gets its own isolated module registry.
  // This is required for jest.unstable_mockModule() to work correctly in ESM —
  // without it, Node caches the real module from the first test file that loads
  // it, and subsequent files that try to mock it get the cached real version.
  // isolateModules: true,

  // Run test files serially in the current process rather than spawning workers.
  // Combined with isolateModules, this ensures each file starts with a clean
  // module registry. Without this, worker processes share the module cache
  // across files even with isolateModules set.
  runner: "jest-runner",
  maxWorkers: 1,

  collectCoverage: false,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/", "/dist/"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/index.ts"],

  verbose: true,
} satisfies Config;
