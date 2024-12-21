import { tradingEconomicsNewCloudService } from ".";
import { asyncHandlerFn } from '../../_core/helper/async-handler/async-handler';
import { withUserContextAndPermissions } from '../../_core/guard/handle-permission/user-context.middleware';
import { createRouter } from '@src/_core/helper/create-router-path';


// Créer un routeur Express
const router = createRouter(__filename);

const cloudFunctions_v1 = {
	"TradingEconomicsNew-test": tradingEconomicsNewCloudService.test,
};

// Convertir chaque fonction en une route Express
Object.entries(cloudFunctions_v1).forEach(([functionName, functionHandler]) => {
	router.post(
		`/api_v1/${functionName}`,
		// authenticateToken, // Add the authentication middleware here
		asyncHandlerFn(
			withUserContextAndPermissions(
				functionHandler.bind(tradingEconomicsNewCloudService)
			)

		));
});



export default router;
