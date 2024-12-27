import { Request, Response, NextFunction } from 'express';
import { displayRequest, getRequest } from '../displayRequest.middleware';
import { blueBright, blue, yellow, greenBright } from 'colorette';

jest.mock('colorette', () => ({
  bgWhite: jest.fn((text) => text),
  bgMagenta: jest.fn((text) => text),
  blueBright: jest.fn((text) => text),
  blue: jest.fn((text) => text),
  yellow: jest.fn((text) => text),
  greenBright: jest.fn((text) => text),
}));

describe('displayRequest Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      originalUrl: '/test-route',
      method: 'GET',
      body: { key: 'value' },
      params: { id: '123' },
      query: { search: 'query' },
      headers: { host: 'localhost:3000' },
    };
    res = {};
    next = jest.fn();
    console.log = jest.fn();
  });

  it('should log request details correctly', () => {
    displayRequest(req as Request, res as Response, next);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('showRequest'));
    expect(console.log).toHaveBeenCalledWith(
      'Request URL:',
      expect.stringContaining(`${blueBright('localhost:3000')}${blue('/test-route')}`)
    );
    expect(console.log).toHaveBeenCalledWith('Method:', yellow('GET'));
    expect(console.log).toHaveBeenCalledWith('Body:', greenBright(JSON.stringify({ key: 'value' }, null, 2)));
    expect(console.log).toHaveBeenCalledWith('Params:', JSON.stringify({ id: '123' }, null, 2));
    expect(console.log).toHaveBeenCalledWith('Query:', JSON.stringify({ search: 'query' }, null, 2));
    expect(next).toHaveBeenCalled();
  });
});

describe('getRequest Utility', () => {
  let req: Partial<Request>;

  beforeEach(() => {
    req = {
      originalUrl: '/test-route',
      method: 'POST',
      body: { data: 'test' },
      params: { id: '456' },
      query: { filter: 'active' },
      headers: { host: 'example.com' },
    };
  });

  it('should return request details as a formatted string', () => {
    const result = getRequest(req as Request);
    const parsedResult = JSON.parse(result);

    expect(parsedResult).toEqual(
      expect.objectContaining({
        url: 'example.com/test-route',
        method: 'POST',
        body: { data: 'test' },
        params: { id: '456' },
        query: { filter: 'active' },
      })
    );
    expect(parsedResult.timestamp).toEqual(expect.any(String));
  });

    it('should handle missing properties gracefully', () => {
        req = {};
        const result = getRequest(req as Request);
        const parsedResult = JSON.parse(result);

        expect(parsedResult).toEqual({
            timestamp: expect.any(String),
            url: undefined,
            method: undefined,
            body: undefined,
            params: undefined,
            query: undefined,
        });
    });
});
