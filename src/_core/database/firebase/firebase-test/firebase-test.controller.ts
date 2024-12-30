// src/firebase-test/firebase-test.controller.ts
import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { FirebaseRepositoryService } from '../firebase-repository/firebase-repository.service';

@Controller('firebase')
export class FirebaseTestController {
    constructor(private readonly firebaseRepo: FirebaseRepositoryService) {}

    @Get(':collection/:id')
    async getDocument(
        @Param('collection') collection: string,
        @Param('id') id: string
    ) {
        return await this.firebaseRepo.getDocument(collection, id);
    }

    @Post(':collection/:id')
    async setDocument(
        @Param('collection') collection: string,
        @Param('id') id: string,
        @Body() data: any
    ) {
        return await this.firebaseRepo.setDocument(collection, id, data);
    }

    @Delete(':collection/:id')
    async deleteDocument(
        @Param('collection') collection: string,
        @Param('id') id: string
    ) {
        return await this.firebaseRepo.deleteDocument(collection, id);
    }
}
