import { createContactHandler } from '../contact.handler';

jest.mock('@/_core/helper/validateZodSchema', () => ({
 validateSchema: jest.fn().mockImplementation(() => {
   return (req: any) => {
     if (!req.body.name) {
       const error = new Error('Name is required');
       throw error; 
     }
   };
 })
}));

jest.mock('../contact.controller.factory', () => ({
 __esModule: true,
 default: {
   createContact: jest.fn().mockImplementation((_req, res) => res.status(201).json({}))
 }
}));

describe('Contact Handler', () => {
 let mockRequest: any;
 let mockResponse: any;
 let mockNext: any;

 beforeEach(() => {
   mockRequest = {
     body: {
       name: 'John Doe',
       email: 'john@example.com',
       phone: '1234567890'
     }
   };
   
   mockResponse = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(),
     headersSent: false
   };
   
   mockNext = jest.fn();

   // Clear all mocks before each test
   jest.clearAllMocks();
 });

 describe('createContact', () => {
   it('should validate request and pass to controller', async () => {
     await createContactHandler(mockRequest, mockResponse, mockNext);
     expect(mockNext).not.toHaveBeenCalled();
   });

   it('should handle validation errors', async () => {
     try {
       delete mockRequest.body.name;
       await createContactHandler(mockRequest, mockResponse, mockNext);
     } catch (error : any) {
       expect(error.message).toBe('Name is required');
     }
   });
 });
});