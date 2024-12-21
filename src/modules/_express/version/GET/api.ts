// src/_core/server/routes.ts
import { packageJson } from '@/_core/logger/log-route';
import { createRouter } from '@@src/_core/helper/create-router-path';
import express from 'express';
const router = createRouter(__filename);
// import from env BASE_API
const base = process.env.BASE_API || 'BASE_API-no-set';

const getVersion = (_req: express.Request, res: express.Response) => {
    res.json({
        name: packageJson.name,
        version: packageJson.version
    });
};

// Version route
router.get(base + '/version', getVersion);
export default router;  // Ensure the router is exported as default
