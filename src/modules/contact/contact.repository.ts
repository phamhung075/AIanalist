// contact.repository.ts
import { firestore } from '@/_core/database/firebase';
import { IContact } from './contact.interface';

class ContactRepository {
  async create(contact: IContact): Promise<IContact> {
    console.log('level Repository');
    try {
      const docRef = await firestore?.collection('contacts').add({
        ...contact,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('Document written with ID: ', docRef?.id);
      return { id: docRef?.id, ...contact };
    } catch (error) {
      console.error('Error adding document');
      throw error;
    }
  }

  async findAll(): Promise<IContact[]> {
    const snapshot = await firestore?.collection('contacts').get();
    return snapshot?.docs.map((doc : any) => ({
      id: doc.id,
      ...doc.data(),
    })) as IContact[];
  }

  async findById(id: string): Promise<IContact | null> {
    const doc = await firestore?.collection('contacts').doc(id).get();
    return doc?.exists ? ({ id: doc?.id, ...doc?.data() } as IContact) : null;
  }

  async update(id: string, updates: Partial<IContact>): Promise<IContact | null> {
    const docRef = firestore?.collection('contacts').doc(id);
    await docRef?.update({
      ...updates,
      updatedAt: new Date(),
    });
    const updatedDoc = await docRef?.get();
    return updatedDoc?.exists ? ({ id: updatedDoc.id, ...updatedDoc.data() } as IContact) : null;
  }

  async delete(id: string): Promise<boolean> {
    await firestore?.collection('contacts').doc(id).delete();
    console.log('Document successfully deleted!');
    return true;
  }
}

export default ContactRepository;
