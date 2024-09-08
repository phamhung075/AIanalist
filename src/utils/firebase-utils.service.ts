import { getAuth, signInWithCustomToken, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, limit, startAfter, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as crypto from 'crypto';
import { PaginationOptions } from '../interfaces/PaginationOptions.interface';
import { FetchPageResult } from '../interfaces/FetchPageResult.interface';


export class FireBaseUtilsService {

	constructor() {
		// this.jwtSecret = configService.getEnvProperty('firebase.jwt')!;
	}

	// Upload an image to Firebase Storage
	async uploadImage(base64Image: string): Promise<{ path: string; publicUrl: string } | null> {
		try {
			const fileExt = base64Image.substring("data:image/".length, base64Image.indexOf(";base64"));
			const fileName = `${crypto.randomUUID()}.${fileExt}`;
			const filePath = `images/${fileName}`;
			const base64Data = base64Image.split(',')[1];

			// Convert base64 to Uint8Array
			const byteCharacters = atob(base64Data);
			const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
			const byteArray = new Uint8Array(byteNumbers);

			// Create a reference to the storage location
			const storage = getStorage();
			const storageRef = ref(storage, filePath);
			await uploadBytes(storageRef, byteArray, { contentType: `image/${fileExt}` });

			// Get public URL of the uploaded image
			const publicUrl = await getDownloadURL(storageRef);

			return { path: filePath, publicUrl };
		} catch (error) {
			console.error('Error uploading image:', error);
			return null;
		}
	}
	// Register user using Firebase Auth
	async registerUser(email: string, password: string): Promise<any> {
		try {
			const auth = getAuth();
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			return userCredential.user;
		} catch (error) {
			console.error('Error registering user:', error);
			throw error;
		}
	}
	// Check for duplicate email (this is usually handled by Firebase automatically on signup)
	async checkDuplicateEmail(email: string): Promise<boolean> {
		try {
			const db = getFirestore();
			const usersRef = collection(db, 'users');
			const q = query(usersRef, where('email', '==', email));
			const querySnapshot = await getDocs(q);
			return !querySnapshot.empty;
		} catch (error) {
			console.error('Error checking duplicate email:', error);
			throw error;
		}
	}

	// Fetch object by ID from Firestore
	async fetchObjectById(collectionName: string, objectId: string): Promise<any> {
		const db = getFirestore();
		const docRef = doc(db, collectionName, objectId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			return docSnap.data();
		} else {
			console.log("No such document!");
			return null;
		}
	}

	// Fetch multiple objects with conditions from Firestore
	async fetchObjects(collectionName: string, conditions?: Record<string, any>): Promise<any[]> {
		try {
			const db = getFirestore();
			const collectionRef = collection(db, collectionName);
			let q = query(collectionRef);
			if (conditions) {
				for (const key in conditions) {
					q = query(q, where(key, '==', conditions[key]));
				}
			}
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(doc => doc.data());
		} catch (error) {
			console.error(`Error fetching objects from ${collectionName}:`, error);
			throw error;
		}
	}

	// Fetch objects with pagination
	async fetchObjectsWithPagination<T>(
		collectionName: string,
		paginationOptions: PaginationOptions
	): Promise<FetchPageResult<T>> {
		try {
			const db = getFirestore();
			const collectionRef = collection(db, collectionName);

			let q = query(collectionRef, orderBy('createdAt'));

			// Apply filters if provided
			if (paginationOptions.filters) {
				paginationOptions.filters.forEach(filter => {
					switch (filter.operator) {
						case 'eq':
							q = query(q, where(filter.key, '==', filter.value));
							break;
						case 'neq':
							q = query(q, where(filter.key, '!=', filter.value));
							break;
						case 'gt':
							q = query(q, where(filter.key, '>', filter.value));
							break;
						case 'gte':
							q = query(q, where(filter.key, '>=', filter.value));
							break;
						case 'lt':
							q = query(q, where(filter.key, '<', filter.value));
							break;
						case 'lte':
							q = query(q, where(filter.key, '<=', filter.value));
							break;
						case 'like':
							// Firestore doesn't natively support LIKE, but if you want to simulate it
							q = query(q, where(filter.key, '>=', filter.value), where(filter.key, '<=', filter.value + '\uf8ff'));
							break;
						default:
							throw new Error(`Unsupported filter operator: ${filter.operator}`);
					}
				});
			}

			// Apply pagination if `all` is not set to true
			if (!paginationOptions.all) {
				const pageSize = paginationOptions.pageSize ?? 10;
				q = query(q, limit(pageSize));

				if (paginationOptions.page && paginationOptions.page > 1 && paginationOptions.lastVisible) {
					q = query(q, startAfter(paginationOptions.lastVisible));
				}
			}

			// Execute the query and fetch the documents
			const querySnapshot = await getDocs(q);
			const data = querySnapshot.docs.map(doc => ({
				...doc.data(),
				id: doc.id, // Include document ID in the result
			}));

			const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			console.log('lastVisible', lastVisible);

			// Calculate total pages and return result
			const total = querySnapshot.size;
			const count = data.length;
			const totalPages = paginationOptions.pageSize ? Math.ceil(total / paginationOptions.pageSize) : 1;

			return {
				data,
				total,
				count,
				page: paginationOptions.page,
				totalPages,
				limit: paginationOptions.pageSize,
			};
		} catch (error) {
			console.error('Error fetching objects with pagination:', error);
			throw error;
		}
	}

	// Update object in Firestore
	async updateObject(collectionName: string, objectId: string, data: any): Promise<void> {
		const db = getFirestore();
		const docRef = doc(db, collectionName, objectId);
		await setDoc(docRef, data, { merge: true });
		console.log('Document updated successfully.');
	}

	// Create object in Firestore
	async createObject(collectionName: string, data: any): Promise<any> {
		try {
			const db = getFirestore();
			const docRef = doc(collection(db, collectionName)); // Creates a new document reference with an auto-generated ID
			await setDoc(docRef, data); // Set the document data

			// Retrieve the full object, including the document ID
			const createdObject = { ...data, id: docRef.id };

			console.log('Document created successfully:', createdObject);
			return createdObject; // Return the full object including the auto-generated ID
		} catch (error) {
			console.error('Error creating document:', error);
			throw error;
		}
	}

	// Delete object from Firestore
	async deleteObject(collectionName: string, objectId: string): Promise<void> {
		const db = getFirestore();
		const docRef = doc(db, collectionName, objectId);
		await deleteDoc(docRef);
		console.log('Document deleted successfully.');
	}

	// Count total objects in Firestore collection
	async fetchTotalCount(collectionName: string): Promise<number> {
		const db = getFirestore();
		const collectionRef = collection(db, collectionName);
		const querySnapshot = await getDocs(collectionRef);
		return querySnapshot.size;
	}

	// Authenticate with a custom token (used in some backend services)
	async authenticateWithCustomToken(token: string): Promise<void> {
		try {
			const auth = getAuth();
			await signInWithCustomToken(auth, token);
			console.log('Authenticated with custom token.');
		} catch (error) {
			console.error('Error authenticating with custom token:', error);
			throw error;
		}
	}

	async signInWithEmailAndPassword(email: string, password: string): Promise<any> {
		try {
			const auth = getAuth();
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			return userCredential.user;
		} catch (error) {
			console.error('Error signing in:', error);
			throw error;
		}
	}

	// Fetch all users (for admin purposes)
	async adminFetchUsers(): Promise<any[]> {
		try {
			const db = getFirestore();
			const usersRef = collection(db, 'users');
			const querySnapshot = await getDocs(usersRef);
			return querySnapshot.docs.map(doc => doc.data());
		} catch (error) {
			console.error('Error fetching users:', error);
			throw error;
		}
	}
}