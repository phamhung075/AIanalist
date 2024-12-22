// contact.repository.ts
import { firestore } from '@/_core/config/firebase.config';
import { IContact } from './contact.interface';

class ContactRepository {
  async create(contact: IContact): Promise<IContact> {
    const docRef = await firestore.collection('contacts').add({
      ...contact,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...contact };
  }

  async findAll(): Promise<IContact[]> {
    const snapshot = await firestore.collection('contacts').get();
    return snapshot.docs.map((doc : any) => ({
      id: doc.id,
      ...doc.data(),
    })) as IContact[];
  }

  async findById(id: string): Promise<IContact | null> {
    const doc = await firestore.collection('contacts').doc(id).get();
    return doc.exists ? ({ id: doc.id, ...doc.data() } as IContact) : null;
  }

  async update(id: string, updates: Partial<IContact>): Promise<IContact | null> {
    const docRef = firestore.collection('contacts').doc(id);
    await docRef.update({
      ...updates,
      updatedAt: new Date(),
    });
    const updatedDoc = await docRef.get();
    return updatedDoc.exists ? ({ id: updatedDoc.id, ...updatedDoc.data() } as IContact) : null;
  }

  async delete(id: string): Promise<void> {
    await firestore.collection('contacts').doc(id).delete();
  }
}

export default ContactRepository;