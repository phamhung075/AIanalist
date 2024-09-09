import * as express from 'express';
import { infoCloudService } from ".";
import { logResponseMiddleware } from '../../_core/helper/log-response-middleware/log-response-middleware';
import { asyncHandlerFn } from '../../_core/helper/async-handler/async-handler';

// Créer un routeur Express


const router = express.Router();

const cloudFunctions_v1_get = {
	"info": infoCloudService.fetchDisplayableServerInfo,
};

// Convertir chaque fonction en une route Express
Object.entries(cloudFunctions_v1_get).forEach(([functionName, functionHandler]) => {
	router.get(
		`/${functionName}`,
		// authenticateToken, // Add the authentication middleware here
		asyncHandlerFn(
			functionHandler.bind(infoCloudService)
		)

	)
});


export default router;