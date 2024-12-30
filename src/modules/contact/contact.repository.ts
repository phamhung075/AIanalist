// contact.repository.ts
import { firestore } from '@/_core/database/firebase-admin-sdk';
import { IContact } from './contact.interface';
import _ERROR from '@/_core/helper/http-status/error';
import { Service } from 'typedi';
import { FetchPageResult, PaginationOptions } from '@/_core/helper/interfaces/FetchPageResult.interface';
import { createPagination } from '@/_core/helper/http-status/common/create-pagination';

@Service()
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
      throw new _ERROR.InternalServerError({
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

  /**
   * Fetch paginated contacts with optional filters and sorting
   */
  async paginator(options: PaginationOptions): Promise<FetchPageResult<IContact>> {
    try {
      const {
        page = 1,
        limit = 10,
        filters = [],
        lastVisible,
        orderBy,
        all = false,
      } = options;

      let query: FirebaseFirestore.Query = firestore.collection('contacts');

      // ✅ Apply filters
      for (const filter of filters) {
        query = query.where(
          filter.key,
          filter.operator as FirebaseFirestore.WhereFilterOp,
          filter.value
        );
      }

      // ✅ Apply sorting
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
      }

      // ✅ Apply pagination or fetch all records
      if (!all) {
        if (lastVisible) {
          query = query.startAfter(lastVisible);
        }
        query = query.limit(limit);
      }

      // ✅ Execute query
      const snapshot = await query.get();
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IContact[];

      // ✅ Calculate pagination metadata
      const totalSnapshot = await firestore.collection('contacts').count().get();
      const totalItems = totalSnapshot.data().count || 0;

      return createPagination<IContact>(data, totalItems, page, limit);
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        throw new _ERROR.ForbiddenError({
          message: 'Permission denied to access contacts',
        });
      }
      throw new _ERROR.InternalServerError({
        message: 'Failed to paginate contacts',
        error: error.message,
      });
    }
  }
}

export default ContactRepository;
