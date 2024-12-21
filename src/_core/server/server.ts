import { appService} from './app/app.service'

appService.listen().catch(error => console.error('Error starting server:', error));

