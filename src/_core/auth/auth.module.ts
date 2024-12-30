// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseService } from '../database/firebase/firebase.service';
import { FirebaseAuthGuard } from './firebase-auth.middleware';
import { LoggerService } from '@/_core/logger-service/logger.service';
import { APP_INTERCEPTOR } from '@node_modules/@nestjs/core';
import { ResponseInterceptor } from '@/_core/interceptor/response.interceptor';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        FirebaseService,
        FirebaseAuthGuard,        
    ],
    exports: [AuthService, FirebaseAuthGuard],
})
export class AuthModule {}