// scripts/test-path-converter.ts
import { spawnSync } from 'child_process';

const testPath = process.argv[2];
if (!testPath) {
    console.error('Please provide a test file path');
    process.exit(1);
}

const fixedPath = testPath.replace(/\\/g, '/');
spawnSync('npx', ['jest', fixedPath], { 
    stdio: 'inherit',
    shell: true 
});