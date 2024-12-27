// src/_core/server/app/__tests__/app.spec.ts
import { app } from '../app.service';
import http from 'http';

jest.mock('express-rate-limit');
jest.mock('helmet');
jest.mock('@/_core/database/firebase');
jest.mock('express-route-tracker/dist', () => ({
 RouteDisplay: jest.fn().mockImplementation(() => ({
   displayRoutes: jest.fn()
 }))
}));
jest.mock('@modules/index', () => {
 const express = require('express');
 const router = express.Router();

 return router;
});

describe('AppService', () => {
 let server: http.Server;

 beforeAll((done) => {
   server = app.listen(4000, done);
 });

 afterAll((done) => {
   server.close(done);
 });


 describe('Server Creation', () => {
   it('should create HTTP server in development', () => {
     expect(server).toBeInstanceOf(http.Server);
   });
 });
});