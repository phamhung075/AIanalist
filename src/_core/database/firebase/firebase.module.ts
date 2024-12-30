// // src/firebase/firebase.module.ts
// import { Module, Global } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { FirebaseService } from './firebase.service';
// import { FirebaseRepositoryService } from './firebase-repository/firebase-repository.service';

// @Global()
// @Module({
//     imports: [ConfigModule], // Ensure ConfigModule is imported
//     providers: [FirebaseService, FirebaseRepositoryService],
//     exports: [FirebaseService, FirebaseRepositoryService],
// })
// export class FirebaseModule {}
