import dotenv from 'dotenv';

// Load environment variables for testing
dotenv.config({ path: 'environment/.env.test' });

// Set Jest-specific environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '4000'; // Ensure a test-specific port
