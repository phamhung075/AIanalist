import * as express from 'express';
import { infoCloudService } from ".";

// Créer un routeur Express
const router = express.Router();

router.get('/info', async (_req, res) => {
	try {
		const info = await infoCloudService.fetchDisplayableServerInfo();
		res.send(info);  // Send the response back
	} catch (error) {
		console.error('Error fetching server info:', error);
		res.status(500).send('Internal Server Error');
	}
});
export default router;