import * as express from 'express';
import { infoCloudService } from ".";

// Créer un routeur Express
const router = express.Router();

router.post('/info', infoCloudService.fetchDisplayableServerInfo.bind(infoCloudService));
