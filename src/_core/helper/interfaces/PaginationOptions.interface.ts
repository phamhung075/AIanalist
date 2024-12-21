import { Timestamp } from "firebase/firestore";

export interface PaginationOptions {
	page?: number;
	limit?: number;
	all?: boolean;
	filters?: {
		key: string;
		value: string | number;
		operator: string;
	}[];
	pageSize?: number;
	useBackendAuth?: boolean;
	joins?: string[];
	includes?: {
		key: string;
		foreignTable: string;
		foreignKey: string;
		subIncludes?: {
			key: string;
			foreignTable: string;
			foreignKey: string;
		}[];
	}[];
	lastVisible?: Timestamp;
}