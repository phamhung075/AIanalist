// firebase.repository.ts
import { firestore } from '@/_core/database/firebase-admin-sdk';
import { IFirebase } from './firebase.interface';

class FirebaseRepository {
  async create(firebase: IFirebase): Promise<IFirebase> {
    console.log('level Repository');
    try {
      const docRef = await firestore?.collection('firebases').add({
        ...firebase,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('Document written with ID: ', docRef?.id);
      return { id: docRef?.id, ...firebase };
    } catch (error) {
      console.error('Error adding document');
      throw error;
    }
  }

  async findAll(): Promise<IFirebase[]> {
    const snapshot = await firestore?.collection('firebases').get();
    return snapshot?.docs.map((doc : any) => ({
      id: doc.id,
      ...doc.data(),
    })) as IFirebase[];
  }

  async findById(id: string): Promise<IFirebase | null> {
    const doc = await firestore?.collection('firebases').doc(id).get();
    return doc?.exists ? ({ id: doc?.id, ...doc?.data() } as IFirebase) : null;
  }

  async update(id: string, updates: Partial<IFirebase>): Promise<IFirebase | null> {
    const docRef = firestore?.collection('firebases').doc(id);
    await docRef?.update({
      ...updates,
      updatedAt: new Date(),
    });
    const updatedDoc = await docRef?.get();
    return updatedDoc?.exists ? ({ id: updatedDoc.id, ...updatedDoc.data() } as IFirebase) : null;
  }

  async delete(id: string): Promise<boolean> {
    await firestore?.collection('firebases').doc(id).delete();
    console.log('Document successfully deleted!');
    return true;
  }
}

export default FirebaseRepository;
