const rateLimit = jest.fn(() => (_req: any, _res: any, next: any) => next());
export default rateLimit;