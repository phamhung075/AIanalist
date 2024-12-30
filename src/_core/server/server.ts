import { appService} from './app/app.service'
import 'reflect-metadata'; // Require for typedi

appService.listen().catch(error => console.error('Error starting server:', error));

