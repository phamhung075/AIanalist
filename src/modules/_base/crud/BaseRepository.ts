import { firestore } from '@/_core/database/firebase-admin-sdk';
import { createPagination } from '@/_core/helper/http-status/common/create-pagination';
import _ERROR from '@/_core/helper/http-status/error';
import { FetchPageResult, PaginationOptions } from '@/_core/helper/interfaces/FetchPageResult.interface';
import { Query } from 'firebase-admin/firestore';

/**
 * Generic Firestore Repository
 */
export abstract class BaseRepository<T extends { id?: string }> {
    protected collectionName: string;

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }

    /**
     * ✅ Access Firestore Collection
     */
    protected get collection(): FirebaseFirestore.CollectionReference {
        return firestore.collection(this.collectionName);
    }

    /**
     * ✅ Create a new document
     */
    async create(data: Omit<T, 'id'>): Promise<T> {
        try {
            const docRef = await this.collection.add({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return { id: docRef.id, ...data } as T;
        } catch (error: any) {
            this.handleFirestoreError(error, 'Failed to create document');
        }
    }

    /**
     * ✅ Create a document with a specific ID
     */
    async createWithId(id: string, data: Omit<T, 'id'>): Promise<T> {
        try {
            await this.collection.doc(id).set({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return { id, ...data } as T;
        } catch (error: any) {
            this.handleFirestoreError(error, 'Failed to create document with ID');
        }
    }

    /**
     * ✅ Fetch all documents
     */
    async findAll(): Promise<T[]> {
        try {
            const snapshot = await this.collection.get();
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];
        } catch (error: any) {
            this.handleFirestoreError(error, 'Failed to fetch documents');
        }
    }

    /**
     * ✅ Find a document by ID
     */
    async findById(id: string): Promise<T | null> {
        try {
            const doc = await this.collection.doc(id).get();
            if (!doc.exists) {
                throw new _ERROR.NotFoundError({ message: `Document with id ${id} not found` });
            }
            return { id: doc.id, ...doc.data() } as T;
        } catch (error: any) {
            this.handleFirestoreError(error, `Failed to fetch document with id ${id}`);
        }
    }

    /**
     * ✅ Update a document by ID
     */
    async update(id: string, updates: Partial<T>): Promise<T | null> {
        try {
            const docRef = this.collection.doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new _ERROR.NotFoundError({ message: `Document with id ${id} not found` });
            }

            await docRef.update({
                ...updates,
                updatedAt: new Date(),
            });

            const updatedDoc = await docRef.get();
            return { id: updatedDoc.id, ...updatedDoc.data() } as T;
        } catch (error: any) {
            this.handleFirestoreError(error, `Failed to update document with id ${id}`);
        }
    }

    /**
     * ✅ Delete a document by ID
     */
    async delete(id: string): Promise<boolean> {
        try {
            const doc = await this.collection.doc(id).get();
            if (!doc.exists) {
                throw new _ERROR.NotFoundError({ message: `Document with id ${id} not found` });
            }

            await this.collection.doc(id).delete();
            return true;
        } catch (error: any) {
            this.handleFirestoreError(error, `Failed to delete document with id ${id}`);
        }
    }

    /**
     * ✅ Paginated Query
     */
    async paginator(options: PaginationOptions): Promise<FetchPageResult<T>> {
        try {
            const {
                page = 1,
                limit = 10,
                filters = [],
                lastVisible,
                orderBy,
                all = false,
            } = options;

            let query: Query = this.collection;

            // Apply filters
            for (const filter of filters) {
                query = query.where(filter.key, filter.operator, filter.value);
            }

            // Apply sorting
            if (orderBy) {
                query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
            }

            // Apply pagination
            if (!all) {
                if (lastVisible) {
                    query = query.startAfter(lastVisible);
                }
                query = query.limit(limit);
            }

            const snapshot = await query.get();
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];

            const totalSnapshot = await firestore.collection(this.collectionName).count().get();
            const totalItems = totalSnapshot.data()?.count || 0;

            return createPagination<T>(data, totalItems, page, limit);
        } catch (error: any) {
            this.handleFirestoreError(error, 'Failed to paginate documents');
        }
    }

    private handleFirestoreError(error: any, defaultMessage: string): never {
        if (error.code === 'permission-denied') {
            throw new _ERROR.ForbiddenError({ message: 'Permission denied' });
        }
        if (error.code === 'not-found') {
            throw new _ERROR.NotFoundError({ message: 'Resource not found' });
        }
        throw new _ERROR.InternalServerError({ message: defaultMessage, error: error.message });
    }
}
