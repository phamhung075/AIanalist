// import { CustomRequest } from "@src/_core/guard/handle-permission/user-context.interface";
// import { BaseRepositoryService } from "./baseRepository.service.abstract";


// export interface PermissionData {
// 	permissions?: string[];
// 	id_ofContactRequester?: string;
// }

// export abstract class BaseRepositoryController<T extends { [key: string]: any; active?: boolean; motDePasse?: string }> {
// 	abstract baseRepositoryService(): BaseRepositoryService<T>;

// 	constructor(private classConstructor: new (...args: any[]) => T) {}

// 	protected getClassName() {
// 		return this.classConstructor.name;
// 	}

// 	async create(req: CustomRequest): Promise<T> {
// 		if (!req.body["parseObj"]) {
// 			console.error(`Error creating ${this.getClassName()}:`, 'No parseObj found');
// 			throw new ;
// 		}

// 		if (!req.userContext) {
// 			console.error(`Error creating ${this.getClassName()}:`, 'No userContext found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		const contactDetailsJSON = req.userContext?.contactDetails;
// 		const requester_objectId = contactDetailsJSON?.objectId;

// 		if(!requester_objectId) {
// 			console.error(`Error creating ${this.getClassName()}:`, 'No requester_objectId found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		try {
// 			const result = await this.baseRepositoryService().create(req.body['parseObj'], requester_objectId);
// 			return result;
// 		} catch (error) {
// 			console.error(`Error creating ${this.getClassName()}:`, error);
// 			throw error;
// 		}
// 	}

// 	async createClient(req: CustomRequest): Promise<T> {
// 		if (!req.body["parseObj"]) {
// 			console.error(`Error creating ${this.getClassName()}:`, 'No parseObj found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		if (!req.userContext) {
// 			console.error(`Error creating ${this.getClassName()}:`, 'No userContext found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		const contactDetailsJSON = req.userContext?.contactDetails;
// 		const requester_objectId = contactDetailsJSON?.objectId;

// 		if(!requester_objectId) {
// 			console.error(`Error creating ${this.getClassName()}:`, 'No requester_objectId found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		try {
// 			const result = await this.baseRepositoryService().createClient(req.body['parseObj'], requester_objectId);
// 			return result;
// 		} catch (error) {
// 			console.error(`Error creating ${this.getClassName()}:`, error);
// 			throw error;
// 		}
// 	}

// 	async get(req: CustomRequest): Promise<Partial<T>> {
// 		if (!req.body["objectId"] || typeof req.body["objectId"] !== 'string' || req.body["objectId"].trim() === '') {
// 			console.error(`Error getting ${this.getClassName()}:`, 'No objectId found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		if (!req.userContext) {
// 			console.error(`Error getting ${this.getClassName()}:`, 'No userContext found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		const contactDetailsJSON = req.userContext?.contactDetails;
// 		const requester_objectId = contactDetailsJSON?.objectId;

// 		if(!requester_objectId) {
// 			console.error(`Error getting ${this.getClassName()}:`, 'No requester_objectId found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		try {
// 			const result = await this.baseRepositoryService().get(req.body['objectId'], requester_objectId);
// 			return result;
// 		} catch (error) {
// 			console.error(`Error getting ${this.getClassName()} with ID ${req.body['objectId']}:`, error);
// 			throw error;
// 		}
// 	}

// 	async getBy(req: CustomRequest): Promise<Partial<T> | undefined> {
// 		if (!req.body["propertyName"] || typeof req.body["propertyName"] !== 'string' || req.body["propertyName"].trim() === '') {
// 			console.error(`Error getting ${this.getClassName()}:`, 'No propertyName found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		if (!req.body["propertyValue"]) {
// 			console.error(`Error getting ${this.getClassName()}:`, 'No propertyValue found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		if (!req.userContext) {
// 			console.error(`Error getting ${this.getClassName()}:`, 'No userContext found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		const contactDetailsJSON = req.userContext?.contactDetails;
// 		const requester_objectId = contactDetailsJSON?.objectId;

// 		if(!requester_objectId) {
// 			console.error(`Error getting ${this.getClassName()}:`, 'No requester_objectId found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		try {
// 			const result = await this.baseRepositoryService().getBy(req.body['propertyName'], req.body['propertyValue'], requester_objectId);
// 			return result;
// 		} catch (error) {
// 			console.error(`Error getting ${this.getClassName()} with property ${req.body['propertyName']}:${req.body['propertyValue']}`, error);
// 			throw error;
// 		}
// 	}

// 	async getClient(req: CustomRequest): Promise<Partial<T>> {
// 		return this.get(req); // Assuming same logic as get
// 	}

// 	async getAll(req: CustomRequest): Promise<Partial<T[]>> {
// 		if (!req.userContext) {
// 			console.error(`Error getting ${this.getClassName()}:`, 'No userContext found');
// 			throw new Error(EnumErrors.NO_USER_LOGGED);
// 		}

// 		const contactDetailsJSON = req.userContext?.contactDetails;
// 		const requester_objectId = contactDetailsJSON?.objectId;

// 		if(!requester_objectId) {
// 			console.error(`Error getting ${this.getClassName()}:`, 'No requester_objectId found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		try {
// 			const result = await this.baseRepositoryService().getAll(requester_objectId);
// 			return result;
// 		} catch (error) {
// 			console.error(`Error getting ${this.getClassName()} objects`, error);
// 			throw error;
// 		}
// 	}

// 	async update(req: CustomRequest): Promise<boolean> {
// 		if (!req.body["objectId"] || typeof req.body["objectId"] !== 'string' || req.body["objectId"].trim() === '') {
// 			console.error(`Error updating ${this.getClassName()}:`, 'No objectId found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		if (!req.body["parseObj"]) {
// 			console.error(`Error updating ${this.getClassName()}:`, 'No parseObj found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		if (!req.userContext) {
// 			console.error(`Error updating ${this.getClassName()}:`, 'No userContext found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		const contactDetailsJSON = req.userContext?.contactDetails;
// 		const requester_objectId = contactDetailsJSON?.objectId;

// 		if(!requester_objectId) {
// 			console.error(`Error updating ${this.getClassName()}:`, 'No requester_objectId found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		try {
// 			const result = await this.baseRepositoryService().update(req.body['objectId'], req.body['parseObj'], requester_objectId);
// 			return result;
// 		} catch (error) {
// 			console.error(`Error updating ${this.getClassName()} with ID ${req.body['objectId']}:`, error);
// 			throw error;
// 		}
// 	}

// 	async updateClient(req: CustomRequest): Promise<boolean> {
// 		return this.update(req); // Assuming same logic as update
// 	}

// 	async disable(req: CustomRequest): Promise<boolean> {
// 		if (!req.body["objectId"] || typeof req.body["objectId"] !== 'string' || req.body["objectId"].trim() === '') {
// 			console.error(`Error disabling ${this.getClassName()}:`, 'No objectId found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		if (!req.userContext) {
// 			console.error(`Error disabling ${this.getClassName()}:`, 'No userContext found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		const contactDetailsJSON = req.userContext?.contactDetails;
// 		const requester_objectId = contactDetailsJSON?.objectId;

// 		if(!requester_objectId) {
// 			console.error(`Error disabling ${this.getClassName()}:`, 'No requester_objectId found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		try {
// 			const result = await this.baseRepositoryService().disable(req.body['objectId'], requester_objectId);
// 			return result;
// 		} catch (error) {
// 			console.error(`Error disabling ${this.getClassName()} with ID ${req.body['objectId']}:`, error);
// 			throw error;
// 		}
// 	}

// 	async disableClient(req: CustomRequest): Promise<boolean> {
// 		return this.disable(req); // Assuming same logic as disable
// 	}



// 	async setActive(req: CustomRequest): Promise<boolean> {
// 		if (!req.body["objectId"] || typeof req.body["objectId"] !== 'string' || req.body["objectId"].trim() === '') {
// 			console.error(`Error setting active ${this.getClassName()}:`, 'No objectId found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		if (req.body["active"] == null || typeof req.body["active"] !== 'boolean') {
// 			console.error(`Error setting active ${this.getClassName()}:`, 'No active found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		if (!req.userContext) {
// 			console.error(`Error setting active ${this.getClassName()}:`, 'No userContext found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		const contactDetailsJSON = req.userContext?.contactDetails;
// 		const requester_objectId = contactDetailsJSON?.objectId;

// 		if(!requester_objectId) {
// 			console.error(`Error setting active ${this.getClassName()}:`, 'No requester_objectId found');
// 			throw new Error(EnumErrors.ERROR_UNKNOWN);
// 		}

// 		try {
// 			const result = await this.baseRepositoryService().setActive(req.body['objectId'], req.body['active'], requester_objectId);
// 			return result;
// 		} catch (error) {
// 			console.error(`Error setting active status of ${this.getClassName()} with ID ${req.body['objectId']}:`, error);
// 			throw error;
// 		}
// 	}

// 	getPermissionData(req: CustomRequest): PermissionData {
// 		const contactDetailsJSON = req.userContext?.contactDetails;
// 		const id_ofContactRequester = contactDetailsJSON?.objectId;
// 		return { id_ofContactRequester };
// 	}
// }
