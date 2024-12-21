export function isRunningWithNodemon(): boolean {
    return Boolean(process.env.__NODEMON__) || process.argv.some(arg => arg.includes('nodemon'));
}

if (isRunningWithNodemon()) {
    console.log('✅ Application is running with Nodemon!');
} else {
    console.log('❌ Application is running without Nodemon!');
}