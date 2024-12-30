// src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Auth } from 'firebase-admin/auth';

// Mock the Firebase Admin Auth type
type MockFirebaseAdminAuth = {
  verifyIdToken: jest.Mock;
  getUser: jest.Mock;
};

// Mock Firebase Client SDK
jest.mock('../config/firebase-client.config', () => ({
  getFirebaseAuth: jest.fn(() => ({
    // Mock methods will be set in individual tests
  })),
}));

// Mock Firebase Admin SDK
jest.mock('../config/firebase-admin.config', () => ({
  firebaseAdminAuth: {
    verifyIdToken: jest.fn(),
    getUser: jest.fn(),
  } as MockFirebaseAdminAuth,
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockFirebaseAdminAuth: MockFirebaseAdminAuth;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockFirebaseAdminAuth = require('../config/firebase-admin.config').firebaseAdminAuth;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    const mockUid = 'test-uid';
    const mockToken = 'test-token';

    it('should register a new user successfully', async () => {
      const mockUserCredential = {
        user: {
          uid: mockUid,
          getIdToken: jest.fn().mockResolvedValue(mockToken),
        },
      };

      const { createUserWithEmailAndPassword } = require('firebase/auth');
      createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);

      const result = await service.register(mockEmail, mockPassword);

      expect(result).toBe(mockToken);
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        mockEmail,
        mockPassword
      );
    });

    it('should throw ConflictException when email is already in use', async () => {
      const { createUserWithEmailAndPassword } = require('firebase/auth');
      createUserWithEmailAndPassword.mockRejectedValue({
        code: 'auth/email-already-in-use',
      });

      await expect(service.register(mockEmail, mockPassword))
        .rejects
        .toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      const { createUserWithEmailAndPassword } = require('firebase/auth');
      createUserWithEmailAndPassword.mockRejectedValue(new Error('Unknown error'));

      await expect(service.register(mockEmail, mockPassword))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('login', () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    const mockToken = 'test-token';

    it('should login user successfully', async () => {
      const mockUserCredential = {
        user: {
          uid: 'test-uid',
          getIdToken: jest.fn().mockResolvedValue(mockToken),
        },
      };

      const { signInWithEmailAndPassword } = require('firebase/auth');
      signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

      const result = await service.login(mockEmail, mockPassword);

      expect(result).toBe(mockToken);
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        mockEmail,
        mockPassword
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const { signInWithEmailAndPassword } = require('firebase/auth');
      signInWithEmailAndPassword.mockRejectedValue({
        code: 'auth/user-not-found',
      });

      await expect(service.login(mockEmail, mockPassword))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      const { signInWithEmailAndPassword } = require('firebase/auth');
      signInWithEmailAndPassword.mockRejectedValue({
        code: 'auth/wrong-password',
      });

      await expect(service.login(mockEmail, mockPassword))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('verifyToken', () => {
    const mockToken = 'test-token';
    const mockDecodedToken = {
      uid: 'test-uid',
      email: 'test@example.com',
    };

    it('should verify token successfully', async () => {
      mockFirebaseAdminAuth.verifyIdToken.mockResolvedValue(mockDecodedToken as admin.auth.DecodedIdToken);

      const result = await service.verifyToken(mockToken);

      expect(result).toEqual(mockDecodedToken);
      expect(mockFirebaseAdminAuth.verifyIdToken).toHaveBeenCalledWith(mockToken);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      mockFirebaseAdminAuth.verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await expect(service.verifyToken(mockToken))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('getUser', () => {
    const mockUid = 'test-uid';
    const mockUserRecord = {
      uid: mockUid,
      email: 'test@example.com',
    };

    it('should get user details successfully', async () => {
      mockFirebaseAdminAuth.getUser.mockResolvedValue(mockUserRecord as admin.auth.UserRecord);

      const result = await service.getUser(mockUid);

      expect(result).toEqual(mockUserRecord);
      expect(mockFirebaseAdminAuth.getUser).toHaveBeenCalledWith(mockUid);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockFirebaseAdminAuth.getUser.mockRejectedValue(new Error('User not found'));

      await expect(service.getUser(mockUid))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});