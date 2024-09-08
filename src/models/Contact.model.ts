import { Timestamp } from "firebase/firestore";

export declare class Contact {
	nom?: string;
	prenom?: string;
	email?: string;
	pseudonyme?: string;
	telephone?: string;
	photo?: string;
	adresse?: string;
	ville?: string;
	codePostal?: string;
	createdBy?: Contact;
	createdById?: string;
	updatedBy?: Contact;
	updatedById?: string;
	id?: string;
	createdAt?: Timestamp;
	updatedAt?: Timestamp;
	active?: boolean;
}