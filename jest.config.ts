import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: true,
  clearMocks: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@scripts/(.*)$': '<rootDir>/src/scripts/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@server/(.*)$': '<rootDir>/src/_core/server/$1',
    '^@database/(.*)$': '<rootDir>/src/_core/database/$1',
    '^@env/(.*)$': '<rootDir>/src/_core/config/$1',
    '^@config/(.*)$': '<rootDir>/src/_core/config/$1',
    '^@environment/(.*)$': '<rootDir>/environment/$1',
    'express-route-tracker/dist': '<rootDir>/src/__mocks__/express-route-tracker/dist',
    'helmet/index.cjs': '<rootDir>/node_modules/helmet/index.cjs',
    'express-rate-limit': '<rootDir>/src/__mocks__/express-rate-limit',
    'helmet': '<rootDir>/src/__mocks__/helmet'

  },
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  rootDir: './'
};

export default config;