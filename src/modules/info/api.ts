import { infoCloudService } from ".";
import { asyncHandlerFn } from '../../_core/helper/async-handler/async-handler';
import { createRouter } from '@@src/_core/helper/create-router-path';

// Instead of creating a standard Express router, use our createRouter helper
const router = createRouter(__filename);

const cloudFunctions_v1_get = {
    "info": infoCloudService.fetchDisplayableServerInfo,
};

// Register routes using the enhanced router
Object.entries(cloudFunctions_v1_get).forEach(([functionName, functionHandler]) => {
    router.get(
        `/${functionName}`,
        // authenticateToken, // Add the authentication middleware here
        asyncHandlerFn(
            functionHandler.bind(infoCloudService)
        )
    );
});

export default router;