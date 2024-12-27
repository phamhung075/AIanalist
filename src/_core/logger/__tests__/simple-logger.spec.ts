jest.mock('path', () => {
  const originalPath = jest.requireActual('path');
  return {
    ...originalPath,
    join: jest.fn((...args: string[]) => originalPath.join('D:\\DaiHung\\__labo\\AIanalist', ...args.slice(1))),
  };
});
import fs from 'fs';
import path from 'path';
import { SimpleLogger } from '../simple-logger';

jest.mock('fs');
jest.spyOn(console, 'log').mockImplementation(); // Suppress console output in tests

describe('SimpleLogger', () => {
  let logger: SimpleLogger;
  let logDir: string;
  let logFile: string;

  beforeEach(() => {
    jest.clearAllMocks();

    logDir = path.resolve(__dirname, '../../../logs');
    logFile = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);

    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockImplementation();
    (fs.appendFileSync as jest.Mock).mockImplementation();

    logger = new SimpleLogger();
  });

  // ✅ Test: Log Directory Creation
//   it('should create the log directory if it does not exist', () => {
//     expect(fs.existsSync).toHaveBeenCalledWith(logDir);
//     expect(fs.mkdirSync).toHaveBeenCalledWith(logDir, { recursive: true });
//   });

  // ✅ Test: Log File Path
  it('should set the correct log file path', () => {
    expect(logger).toHaveProperty('logFile', logFile);
  });

  // ✅ Test: Info Log
  it('should write an info log message to the file and console', () => {
    logger.info('Test info message', { key: 'value' });

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[INFO] Test info message')
    );
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/app-\d{4}-\d{2}-\d{2}\.log$/),
      expect.stringContaining('[INFO] Test info message')
    );
  });

  // ✅ Test: Error Log
  it('should write an error log message to the file and console', () => {
    const error = new Error('Test error');
    logger.error('Test error message', error);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[ERROR] Test error message')
    );
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/app-\d{4}-\d{2}-\d{2}\.log$/),
      expect.stringContaining('Test error')
    );
  });

  // ✅ Test: Warn Log
  it('should write a warn log message to the file and console', () => {
    logger.warn('Test warn message', { key: 'warnValue' });

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[WARN] Test warn message')
    );
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/app-\d{4}-\d{2}-\d{2}\.log$/),
      expect.stringContaining('[WARN] Test warn message')
    );
  });

  // ✅ Test: Debug Log
  it('should write a debug log message to the file and console', () => {
    logger.debug('Test debug message', { debugKey: 'debugValue' });

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[DEBUG] Test debug message')
    );
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/app-\d{4}-\d{2}-\d{2}\.log$/),
      expect.stringContaining('[DEBUG] Test debug message')
    );
  });

  // ✅ Test: Metadata Logging
  it('should include metadata in the log', () => {
    logger.info('Test metadata', { metaKey: 'metaValue' });

    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/app-\d{4}-\d{2}-\d{2}\.log$/),
      expect.stringContaining('{"metaKey":"metaValue"}')
    );
  });

  // ✅ Test: Log without Metadata
  it('should handle logs without metadata gracefully', () => {
    logger.info('Test without metadata');

    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/app-\d{4}-\d{2}-\d{2}\.log$/),
      expect.stringContaining('[INFO] Test without metadata')
    );
  });
});
