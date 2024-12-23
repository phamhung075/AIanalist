import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/__tests__/**/*.spec.ts'],
	moduleFileExtensions: ['ts', 'js', 'json'],
	verbose: true,
	clearMocks: true,
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^@src/(.*)$': '<rootDir>/src/$1',
		'^@modules/(.*)$': '<rootDir>/src/modules/$1',
		'^firebase-admin$': '<rootDir>/__mocks__/firebase-admin.ts',
		'^@environment/(.*)$': '<rootDir>/environment/$1',
		'^@config/(.*)$': '<rootDir>/src/_core/config/$1',
		'^@server/(.*)$': '<rootDir>/src/_core/server/$1',
		'^@database/(.*)$': '<rootDir>/src/_core/database/$1'
	},
	setupFiles: ['dotenv/config'],
	rootDir: './'
};

export default config;
