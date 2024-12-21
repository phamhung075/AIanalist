import { createRouter } from '@@src/_core/helper/create-router-path';
import { successTestCloudService } from '.';
import { asyncHandlerFn } from '../../_core/helper/async-handler/async-handler';

// Créer un routeur Express


const router = createRouter(__filename);

const cloudFunctions_v1_get = {
	"Success-OKResponse": successTestCloudService.OKResponse,
	"Success-CreatedResponse": successTestCloudService.CreatedResponse,
	"Success-AcceptedResponse": successTestCloudService.AcceptedResponse,
	"Success-NonAuthoritativeInformationResponse": successTestCloudService.NonAuthoritativeInformationResponse,
	"Success-NoContentResponse": successTestCloudService.NoContentResponse,
	"Success-ResetContentResponse": successTestCloudService.ResetContentResponse,
	"Success-PartialContentResponse": successTestCloudService.PartialContentResponse,
	"Success-MultiStatusResponse": successTestCloudService.MultiStatusResponse,
	"Success-AlreadyReportedResponse": successTestCloudService.AlreadyReportedResponse,
	"Success-IMUsedResponse": successTestCloudService.IMUsedResponse,	
};

// Convertir chaque fonction en une route Express
Object.entries(cloudFunctions_v1_get).forEach(([functionName, functionHandler]) => {
	router.get(
		`/${functionName}`,
		// authenticateToken, // Add the authentication middleware here
		asyncHandlerFn(
			functionHandler.bind(successTestCloudService)
		)
	)
});


export default router;