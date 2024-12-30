import os from 'os';
import process from 'process';
import { database } from '@/_core/database/firebase-admin-sdk';
import { checkSystemOverload } from '../check-system-overload';

// ✅ Mock system modules and Firebase
jest.mock('os');
jest.mock('@/_core/database/firebase', () => ({
  database: {
    ref: jest.fn(() => ({
      once: jest.fn(),
    })),
  },
}));

jest.useFakeTimers(); // Control `setInterval`

describe('checkSystemOverload', () => {
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(process, 'memoryUsage').mockReturnValue({
      rss: 500000000, // ~500 MB
      heapTotal: 0,
      heapUsed: 0,
      external: 0,
      arrayBuffers: 0,
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  // ✅ Test: Log system resource usage
  it('should log system resource usage', async () => {
    // Mock CPU cores
    (os.cpus as jest.Mock).mockReturnValue([{}, {}, {}, {}]); // 4 cores

    // Mock database usage
    (database.ref as jest.Mock).mockReturnValue({
      once: jest.fn().mockResolvedValue({
        numChildren: () => 10,
      }),
    });

    // Call the function
    checkSystemOverload();

    // Advance timers and resolve promises
    jest.advanceTimersByTime(10000); // 10 seconds
    await Promise.resolve(); // Allow pending promises to resolve

    // Validate logs
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Memory usage :: 476.837158203125 MB'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('maxConnections accept :: 20'));
    expect(consoleLogSpy).toHaveBeenCalledWith('Admin SDK does not directly monitor connection status.');
    expect(consoleLogSpy).toHaveBeenCalledWith('Number of documents (children) in Realtime Database: 10');
  });

  // ✅ Test: Handle database errors gracefully
  it('should handle database errors gracefully', async () => {
    // Mock CPU cores
    (os.cpus as jest.Mock).mockReturnValue([{}, {}, {}]); // 3 cores

    // Mock database error
    (database.ref as jest.Mock).mockReturnValue({
      once: jest.fn().mockRejectedValue(new Error('Database access failed')),
    });

    // Call the function
    checkSystemOverload();

    // Advance timers and resolve promises
    jest.advanceTimersByTime(10000); // 10 seconds
    await Promise.resolve(); // Allow pending promises to resolve

    // Validate logs
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Memory usage :: 476.837158203125 MB'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('maxConnections accept :: 15'));
    expect(consoleLogSpy).toHaveBeenCalledWith('Admin SDK does not directly monitor connection status.');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '❌ Error accessing Realtime Database:',
      expect.any(Error)
    );
  });
});
