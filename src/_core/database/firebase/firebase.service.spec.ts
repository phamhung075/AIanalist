// // src/database/firebase/firebase.service.spec.ts
// import { Test, TestingModule } from '@nestjs/testing';
// import { FirebaseService } from './firebase.service';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// describe('FirebaseService', () => {
//     let service: FirebaseService;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             imports: [
//                 ConfigModule.forRoot({
//                     isGlobal: true,
//                 }),
//             ],
//             providers: [FirebaseService, ConfigService],
//         }).compile();

//         service = module.get<FirebaseService>(FirebaseService);
//     });

//     it('should be defined', () => {
//         expect(service).toBeDefined();
//     });

//     it('should initialize Firebase', () => {
//         expect(() => service.onModuleInit()).not.toThrow();
//     });
// });
