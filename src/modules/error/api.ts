import { createRouter } from '@src/_core/helper/create-router-path';
import { ErrorController } from './error.controller';
import { ErrorTestService } from './error.service';
import { asyncHandlerFn } from '@src/_core/helper/async-handler/async-handler';

// Créer un routeur Express
const router = createRouter(__filename);
const controller = new ErrorController(new ErrorTestService());

const routes = {
    'bad-request': controller.BadRequestError,
    'validation': controller.ValidationError,
    // ... other routes
};

Object.entries(routes).forEach(([path, handler]) => {
    router.get(
        `/error/${path}`,
        asyncHandlerFn(handler.bind(controller))
    );
});

export default router;