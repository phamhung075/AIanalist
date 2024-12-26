import { isRunningWithNodemon } from "..";

describe('isRunningWithNodemon', () => {
    const originalEnv = process.env;
    const originalArgv = process.argv;

    beforeEach(() => {
        process.env = { ...originalEnv };
        process.argv = [...originalArgv];
    });

    afterEach(() => {
        process.env = originalEnv;
        process.argv = originalArgv;
    });

    it('should return true when NODEMON env is true', () => {
        process.env.NODEMON = 'true';
        expect(isRunningWithNodemon()).toBe(true);
    });

    it('should return true when NODE_ENV is development', () => {
        process.env.NODE_ENV = 'development';
        expect(isRunningWithNodemon()).toBe(true);
    });

    it('should return true when argv includes nodemon', () => {
        process.argv.push('nodemon');
        expect(isRunningWithNodemon()).toBe(true);
    });

    it('should return false when no nodemon conditions are met', () => {
        delete process.env.NODEMON;
        process.env.NODE_ENV = 'production';
        process.argv = ['node', 'script.js'];
        expect(isRunningWithNodemon()).toBe(false);
    });
});