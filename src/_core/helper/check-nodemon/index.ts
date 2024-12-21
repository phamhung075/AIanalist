import { yellow } from "colorette";

export function isRunningWithNodemon(): boolean {
    return process.env.NODEMON === 'true' || process.env.NODE_ENV === 'development' || process.argv.some(arg => arg.includes('nodemon'));
  }

if (isRunningWithNodemon()) {
    console.log(yellow('✅ Application is running with Nodemon!'));
} else {
    console.error('❌ Application is running without Nodemon!');
}