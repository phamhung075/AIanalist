import * as express from 'express';
import { tradingEconomicsNewCloudService } from ".";
import { asyncHandlerFn } from '../../_core/helper/asyncHandler/asyncHandler';
import { withUserContextAndPermissions } from '../../_core/guard/handle-permission/user-context.middleware';


// Créer un routeur Express
const router = express.Router();

const cloudFunctions = {
	"New-create": tradingEconomicsNewCloudService.create,
};

// Convertir chaque fonction en une route Express
Object.entries(cloudFunctions).forEach(([functionName, functionHandler]) => {
	router.post(
		`/functions/${functionName}`,
		// authenticateToken, // Add the authentication middleware here
		asyncHandlerFn(
			withUserContextAndPermissions(
				functionHandler.bind(tradingEconomicsNewCloudService)
			)
		)
	);
});
export default router;
