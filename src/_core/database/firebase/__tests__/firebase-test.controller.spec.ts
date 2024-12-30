// src/database/firebase/firebase-test/firebase-test.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseTestController } from './firebase-test.controller';
import { FirebaseRepositoryService } from '../firebase-repository/firebase-repository.service';

describe('FirebaseTestController', () => {
    let controller: FirebaseTestController;
    let repositoryService: FirebaseRepositoryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FirebaseTestController],
            providers: [
                {
                    provide: FirebaseRepositoryService,
                    useValue: {
                        getDocument: jest
                            .fn()
                            .mockResolvedValue({ id: '123', name: 'Test' }),
                        setDocument: jest
                            .fn()
                            .mockResolvedValue({ success: true }),
                        deleteDocument: jest
                            .fn()
                            .mockResolvedValue({ success: true }),
                    },
                },
            ],
        }).compile();

        controller = module.get<FirebaseTestController>(FirebaseTestController);
        repositoryService = module.get<FirebaseRepositoryService>(
            FirebaseRepositoryService
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should get a document', async () => {
        const result = await controller.getDocument('users', '123');
        expect(result).toEqual({ id: '123', name: 'Test' });
        expect(repositoryService.getDocument).toHaveBeenCalledWith(
            'users',
            '123'
        );
    });

    it('should set a document', async () => {
        const result = await controller.setDocument('users', '123', {
            name: 'Test',
        });
        expect(result).toEqual({ success: true });
        expect(repositoryService.setDocument).toHaveBeenCalledWith(
            'users',
            '123',
            {
                name: 'Test',
            }
        );
    });

    it('should delete a document', async () => {
        const result = await controller.deleteDocument('users', '123');
        expect(result).toEqual({ success: true });
        expect(repositoryService.deleteDocument).toHaveBeenCalledWith(
            'users',
            '123'
        );
    });
});
