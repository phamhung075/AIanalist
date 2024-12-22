// contact.model.ts
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();
export const contactCollection = db.collection('contacts');
