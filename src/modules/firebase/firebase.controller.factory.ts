// firebase.controller.factory.ts
import FirebaseController from './firebase.controller';
import FirebaseService from './firebase.service';
import FirebaseRepository from './firebase.repository';

const firebaseRepository = new FirebaseRepository();
const firebaseService = new FirebaseService(firebaseRepository);
const firebaseController = new FirebaseController(firebaseService);

export default firebaseController;
