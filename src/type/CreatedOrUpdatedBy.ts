import { Timestamp } from "firebase/firestore";
import { Contact } from "../models/Contact.model";

export type CreatedOrUpdatedBy = {
	contactId?: string;
	contact?: Partial<Contact>;
	timestamp?: Timestamp;
};