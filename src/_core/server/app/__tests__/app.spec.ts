jest.mock('@/_core/logger/simple-logger');
jest.mock('@/_core/database/firebase', () => ({
 testFirestoreAccess: jest.fn().mockResolvedValue(true)
}));

// Mock router
jest.mock('@modules/index', () => ({
 default: {
   use: jest.fn()
 }
}));
// Mocks at top
jest.mock('@/_core/logger/simple-logger');
jest.mock('@/_core/database/firebase', () => ({
  testFirestoreAccess: jest.fn().mockResolvedValue(true)
}));

jest.mock('@modules/index', () => ({
  default: { use: jest.fn() }
}));

jest.mock('@node_modules/express-route-tracker/dist', () => ({
  RouteDisplay: jest.fn().mockImplementation(() => ({
    displayRoutes: jest.fn()
  }))
}));

jest.mock('@src/_core/helper/check-nodemon', () => ({
  isRunningWithNodemon: jest.fn().mockReturnValue(true)
}));

jest.mock('colorette', () => ({
  blue: jest.fn(),
  green: jest.fn(),
  yellow: jest.fn()
}));
// Mock required but not testing 

import request from 'supertest';
import { AppService, app } from '../app.service';
import { NextFunction, Request, Response } from 'express';

describe('AppService', () => {
 let appService: AppService;

 beforeEach(() => {
   jest.clearAllMocks();
   process.env.NODE_ENV = 'development';
   appService = AppService.getInstance();
 });

 afterEach(() => {
   process.env.NODE_ENV = 'test';
 });

 describe('Error Handling', () => {
   it('should handle internal server errors', async () => {
     const errorMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
       next(new Error('Test error'));
     };
     app.use('/test-error', errorMiddleware);

     const response = await request(app).get('/test-error');
     expect(response.status).toBe(500);
     expect(response.body.success).toBe(false);
   });
 });

 describe('Server Creation', () => {
   it('should create HTTP server in development', async () => {
     process.env.NODE_ENV = 'development';
     const server = await appService.listen();
     expect(server).toBeDefined();
     server.close();
   });
 });
});