// contact.repository.ts
import { firestore } from '@/_core/database/firebase-admin-sdk';
import { IContact } from './contact.interface';
import _ERROR from '@/_core/helper/http-status/error';

class ContactRepository {
  async create(contact: IContact): Promise<IContact> {
      try {
          const docRef = await firestore?.collection('contacts').add({
              ...contact,
              createdAt: new Date(),
              updatedAt: new Date(),
          });
          return { id: docRef?.id, ...contact };
      } catch (error: any) {
          if (error.code === 'permission-denied') {
              throw new _ERROR.ForbiddenError({
                  message: 'Permission denied to create contact'
              });
          }
          if (error.code === 'not-found') {
              throw new _ERROR.NotFoundError({
                  message: 'Collection not found'
              });
          }
          throw new _ERROR.({
              message: 'Failed to create contact',
              error: error.message
          });
      }
  }

  async createWithId(id: string, contact: IContact): Promise<IContact> {
      try {
          await firestore.collection('contacts').doc(id).set({
              ...contact,
              createdAt: new Date(),
              updatedAt: new Date(),
          });
          return { id, ...contact };
      } catch (error: any) {
          if (error.code === 'permission-denied') {
              throw new _ERROR.ForbiddenError({
                  message: 'Permission denied to create contact'
              });
          }
          if (error.code === 'not-found') {
              throw new _ERROR.NotFoundError({
                  message: 'Document not found'
              });
          }
          throw new _ERROR.InternalServerError({
              message: 'Failed to create contact',
              error: error.message
          });
      }
  }

  async findAll(): Promise<IContact[]> {
    try {
        const snapshot = await firestore?.collection('contacts').get();
        return snapshot?.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
        })) as IContact[];
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            throw new _ERROR.ForbiddenError({
                message: 'Permission denied to access contacts'
            });
        }
        throw new _ERROR.InternalServerError({
            message: 'Failed to fetch contacts',
            error: error.message
        });
    }
 }
 
 async findById(id: string): Promise<IContact | null> {
    try {
        const doc = await firestore?.collection('contacts').doc(id).get();
        if (!doc?.exists) {
            throw new _ERROR.NotFoundError({
                message: `Contact with id ${id} not found`
            });
        }
        return { id: doc?.id, ...doc?.data() } as IContact;
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            throw new _ERROR.ForbiddenError({
                message: 'Permission denied to access contact'
            });
        }
        if (error.code === 'not-found') {
            throw new _ERROR.NotFoundError({
                message: `Contact with id ${id} not found`
            });
        }
        throw new _ERROR.InternalServerError({
            message: 'Failed to fetch contact',
            error: error.message
        });
    }
 }
 
 async update(id: string, updates: Partial<IContact>): Promise<IContact | null> {
    try {
        const docRef = firestore?.collection('contacts').doc(id);
        const doc = await docRef?.get();
        
        if (!doc?.exists) {
            throw new _ERROR.NotFoundError({
                message: `Contact with id ${id} not found`
            });
        }
 
        await docRef?.update({
            ...updates,
            updatedAt: new Date(),
        });
 
        const updatedDoc = await docRef?.get();
        return { id: updatedDoc?.id, ...updatedDoc?.data() } as IContact;
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            throw new _ERROR.ForbiddenError({
                message: 'Permission denied to update contact'
            });
        }
        if (error.code === 'not-found') {
            throw new _ERROR.NotFoundError({
                message: `Contact with id ${id} not found`
            });
        }
        throw new _ERROR.InternalServerError({
            message: 'Failed to update contact',
            error: error.message
        });
    }
 }
 
 async delete(id: string): Promise<boolean> {
    try {
        const doc = await firestore?.collection('contacts').doc(id).get();
        if (!doc?.exists) {
            throw new _ERROR.NotFoundError({
                message: `Contact with id ${id} not found`
            });
        }
        
        await firestore?.collection('contacts').doc(id).delete();
        return true;
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            throw new _ERROR.ForbiddenError({
                message: 'Permission denied to delete contact'
            });
        }
        if (error.code === 'not-found') {
            throw new _ERROR.NotFoundError({
                message: `Contact with id ${id} not found`
            });
        }
        throw new _ERROR.InternalServerError({
            message: 'Failed to delete contact',
            error: error.message
        });
    }
 }
}

export default ContactRepository;
