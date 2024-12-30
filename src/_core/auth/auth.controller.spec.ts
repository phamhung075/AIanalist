// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { FirebaseService } from '@/database/firebase/firebase.service';
// import _SUCCESS from '@/_core/http-status/success';

// describe('AuthController', () => {
//   let controller: AuthController;
//   let authService: AuthService;

//   // Helper to create mock request object
//   const createMockReq = () => ({
//     startTime: Date.now(),
//     user: { uid: 'mock-uid' }
//   });

//   // Helper to create mock response object
//   const createMockRes = () => {
//     const headers = {};
//     return {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//       setHeader: jest.fn().mockImplementation((key, value) => {
//         headers[key] = value;
//         return this;
//       }),
//       getHeader: jest.fn().mockImplementation((key) => headers[key]),
//       headers,
//     };
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [
//         {
//           provide: AuthService,
//           useValue: {
//             register: jest.fn().mockResolvedValue({ token: 'mock-token' }),
//             login: jest.fn().mockResolvedValue({ token: 'mock-token' }),
//             verifyToken: jest.fn().mockResolvedValue({ uid: 'mock-uid' }),
//             getUser: jest.fn().mockResolvedValue({ uid: 'mock-uid', email: 'test@example.com' }),
//           }
//         },
//         {
//           provide: FirebaseService,
//           useValue: {
//             verifyIdToken: jest.fn().mockResolvedValue({ uid: 'mock-uid' }),
//             getAuth: jest.fn(),
//           }
//         }
//       ],
//     }).compile();

//     controller = module.get<AuthController>(AuthController);
//     authService = module.get<AuthService>(AuthService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('register', () => {
//     it('should return success response with registration data', async () => {
//       const registerDto = {
//         email: 'test@example.com',
//         password: 'password123'
//       };
//       const mockReq = createMockReq();
//       const mockRes = createMockRes();

//       await controller.register(
//         registerDto.email,
//         registerDto.password,
//         mockReq,
//         mockRes
//       );

//       expect(authService.register).toHaveBeenCalledWith(
//         registerDto.email,
//         registerDto.password
//       );

//       expect(mockRes.json).toHaveBeenCalledWith({
//         success: true,
//         message: 'User registered successfully',
//         data: { token: 'mock-token' },
//         metadata: {
//           code: 200,
//           status: 'Ok',
//           responseTime: expect.stringMatching(/^\d+ms$/),
//           timestamp: expect.any(String)
//         }
//       });

//       expect(mockRes.setHeader).toHaveBeenCalledWith(
//         'X-Response-Time',
//         expect.stringMatching(/^\d+ms$/)
//       );
//     });
//   });

//   describe('login', () => {
//     it('should return success response with login data', async () => {
//       const loginDto = {
//         email: 'test@example.com',
//         password: 'password123'
//       };
//       const mockReq = createMockReq();
//       const mockRes = createMockRes();

//       await controller.login(
//         loginDto.email,
//         loginDto.password,
//         mockReq,
//         mockRes
//       );

//       expect(authService.login).toHaveBeenCalledWith(
//         loginDto.email,
//         loginDto.password
//       );

//       expect(mockRes.json).toHaveBeenCalledWith({
//         success: true,
//         message: 'User logged in successfully',
//         data: { token: 'mock-token' },
//         metadata: {
//           code: 200,
//           status: 'Ok',
//           responseTime: expect.stringMatching(/^\d+ms$/),
//           timestamp: expect.any(String)
//         }
//       });

//       expect(mockRes.setHeader).toHaveBeenCalledWith(
//         'X-Response-Time',
//         expect.stringMatching(/^\d+ms$/)
//       );
//     });
//   });

//   describe('verify', () => {
//     it('should return success response with user data', async () => {
//       const mockUser = { uid: 'mock-uid', email: 'test@example.com' };
//       const mockReq = { 
//         user: mockUser,
//         startTime: Date.now()
//       };
//       const mockRes = createMockRes();

//       await controller.verify(mockReq, mockRes);

//       expect(mockRes.json).toHaveBeenCalledWith({
//         success: true,
//         message: 'User verified successfully',
//         data: mockUser,
//         metadata: {
//           code: 200,
//           status: 'Ok',
//           responseTime: expect.stringMatching(/^\d+ms$/),
//           timestamp: expect.any(String)
//         }
//       });

//       expect(mockRes.setHeader).toHaveBeenCalledWith(
//         'X-Response-Time',
//         expect.stringMatching(/^\d+ms$/)
//       );
//     });
//   });

//   describe('getCurrentUser', () => {
//     it('should return success response with user data', async () => {
//       const mockUser = { uid: 'mock-uid' };
//       const mockUserData = { uid: 'mock-uid', email: 'test@example.com' };
//       const mockReq = { 
//         user: mockUser,
//         startTime: Date.now()
//       };
//       const mockRes = createMockRes();

//       await controller.getCurrentUser(mockReq, mockRes);

//       expect(authService.getUser).toHaveBeenCalledWith(mockUser.uid);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         success: true,
//         message: 'User fetched successfully',
//         data: mockUserData,
//         metadata: {
//           code: 200,
//           status: 'Ok',
//           responseTime: expect.stringMatching(/^\d+ms$/),
//           timestamp: expect.any(String)
//         }
//       });

//       expect(mockRes.setHeader).toHaveBeenCalledWith(
//         'X-Response-Time',
//         expect.stringMatching(/^\d+ms$/)
//       );
//     });
//   });

//   describe('error handling', () => {
//     it('should propagate errors from authService', async () => {
//       const error = new Error('Authentication failed');
//       authService.login = jest.fn().mockRejectedValue(error);
      
//       const mockReq = createMockReq();
//       const mockRes = createMockRes();

//       await expect(controller.login(
//         'test@example.com',
//         'password123',
//         mockReq,
//         mockRes
//       )).rejects.toThrow('Authentication failed');
//     });
//   });
// });