import { Router } from 'express';

export const createRouter = jest.fn((filename: string) => {
    console.log('Mocked createRouter called with filename:', filename);
    return Router();
});