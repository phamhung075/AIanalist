import { firestore } from 'firebase-admin';

export class FirebaseRepositoryService {
    async getDocument(collection: string, documentId: string) {
        const docRef = firestore().collection(collection).doc(documentId);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new Error('Document not found');
        }
        return doc.data();
    }

    async setDocument(collection: string, documentId: string, data: any) {
        await firestore().collection(collection).doc(documentId).set(data);
        return { success: true };
    }

    async deleteDocument(collection: string, documentId: string) {
        await firestore().collection(collection).doc(documentId).delete();
        return { success: true };
    }
}
