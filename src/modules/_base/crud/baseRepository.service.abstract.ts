import { EnumErrors } from "../../../enums/Error";
import { FireBaseUtilsService } from "@utils/firebase-utils.service";
import { FetchPageResult, PaginationOptions } from "@src/_core/helper/interfaces/FetchPageResult.interface";



export abstract class BaseRepositoryService<T extends { [key: string]: any; active?: boolean; motDePasse?: string }> {
	protected fireBaseUtilsService: FireBaseUtilsService;
	PAGE_MAX_SIZE = 20;

	constructor(
		fireBaseUtilsService = new FireBaseUtilsService(),
		private classConstructor: new (...args: any[]) => T
	) {
		this.fireBaseUtilsService = fireBaseUtilsService;
	}

	protected getFireBaseUtilsService(): FireBaseUtilsService {
		return this.fireBaseUtilsService;
	}

	protected getClassName(): string {
		return this.classConstructor.name;
	}

	protected createReference(tableName: string, id: string): any {
		return { id, tableName }; // Use the ID as a reference
	}

	async create(data: Partial<T>, createdBy: string): Promise<T> {
		try {
			const canCreate = await this.checkAdminPermission(createdBy);
			if (!canCreate) throw new Error(EnumErrors.ERROR_PERMISSION);

			const dataToInsert = { ...data, createdBy } as Partial<T>;
			const result = await this.fireBaseUtilsService.createObject(this.getClassName(), dataToInsert) as T;

			if (!result) {
				console.error(`Error creating ${this.getClassName()}:`, 'No result');
				throw new Error(EnumErrors.ERROR_UNKNOWN);
			}
			return result;
		} catch (error) {
			console.error(`Error creating ${this.getClassName()}:`, error);
			throw new Error(EnumErrors.ERROR_UNKNOWN);
		}
	}

	async get(objectId: string, requesterId: string): Promise<Partial<T>> {
		try {
			const canGet = await this.checkAdminPermission(requesterId);
			if (!canGet) throw new Error(EnumErrors.ERROR_PERMISSION);

			const data = await this.fireBaseUtilsService.fetchObjectById(this.getClassName(), objectId) as T;

			if (!data || !data.active) throw new Error(EnumErrors.ERROR_PERMISSION);

			return data;
		} catch (error) {
			console.error(`Error getting ${this.getClassName()} with ID ${objectId}:`, error);
			throw error;
		}
	}

	async getBy(propertyName: string, propertyValue: any, requesterId: string): Promise<Partial<T> | undefined> {
		try {
			const canGet = await this.checkAdminPermission(requesterId);
			if (!canGet) throw new Error(EnumErrors.ERROR_PERMISSION);

			const data = await this.fireBaseUtilsService.fetchObjects(this.getClassName(), { [propertyName]: propertyValue }) as T[];

			if (data.length > 0) {
				const firstObject = data[0];
				if (!firstObject.active) throw new Error(EnumErrors.ERROR_PERMISSION);
				return firstObject;
			}

			return undefined;
		} catch (error) {
			console.error(`Error getting ${this.getClassName()} with property ${propertyName}:${propertyValue}`, error);
			throw error;
		}
	}
	async getAll(requesterId: string): Promise<Partial<T[]>> {
		try {
			const data = await this.fireBaseUtilsService.fetchObjects(this.getClassName(), {}) as T[];

			if (!data) throw new Error(EnumErrors.ERROR_UNKNOWN);

			const cleanedDataList = data.filter((item: T) => item.active);

			const canGetAll = await this.checkAdminPermission(requesterId);
			if (!canGetAll) throw new Error(EnumErrors.ERROR_PERMISSION);

			return cleanedDataList;
		} catch (error) {
			console.error(`Error getting ALL ${this.getClassName()} objects:`, error);
			throw error;
		}
	}

	async fetchPage(
		requesterId: string,
		paginationOptions: PaginationOptions
	): Promise<FetchPageResult<T>> {
		try {
			const canGetAll = await this.checkAdminPermission(requesterId);
			if (!canGetAll) throw new Error(EnumErrors.ERROR_PERMISSION);

			const profiles = await this.fireBaseUtilsService.fetchObjectsWithPagination(
				this.getClassName(),
				paginationOptions,
			);

			return profiles;
		} catch (error) {
			console.error(`Error getting ALL ${this.getClassName()} objects:`, error);
			throw error;
		}
	}

	async update(objectId: string, data: Partial<T>, requesterId: string): Promise<boolean> {
		try {
			const canUpdate = await this.checkAdminPermission(requesterId);
			if (!canUpdate) throw new Error(EnumErrors.ERROR_PERMISSION);

			const dataToUpdate = await this.fireBaseUtilsService.fetchObjectById(this.getClassName(), objectId) as T;
			if (!dataToUpdate || !dataToUpdate.active) throw new Error(EnumErrors.ERROR_PERMISSION);

			const updatedData = { ...data, updatedBy: requesterId };
			const result = await this.fireBaseUtilsService.updateObject(this.getClassName(), objectId, updatedData);
			return result !== null;
		} catch (error) {
			console.error(`Error updating ${this.getClassName()} with ID ${objectId}:`, error);
			throw error;
		}
	}

	async disable(objectId: string, requesterId: string): Promise<boolean> {
		try {
			const canDisable = await this.checkAdminPermission(requesterId);
			if (!canDisable) throw new Error(EnumErrors.ERROR_PERMISSION);

			const dataToDisable = await this.fireBaseUtilsService.fetchObjectById(this.getClassName(), objectId) as T;
			if (!dataToDisable || !dataToDisable.active) throw new Error(EnumErrors.ERROR_PERMISSION);

			const updatedData = { ...dataToDisable, active: false, updatedBy: requesterId };
			const result = await this.fireBaseUtilsService.updateObject(this.getClassName(), objectId, updatedData);
			return result !== null;
		} catch (error) {
			console.error(`Error disabling ${this.getClassName()} with ID ${objectId}:`, error);
			throw error;
		}
	}

	async setActive(objectId: string, active: boolean, requesterId: string): Promise<boolean> {
		try {
			const canSetActive = await this.checkAdminPermission(requesterId);
			if (!canSetActive) throw new Error(EnumErrors.ERROR_PERMISSION);

			const dataToSetActive = await this.fireBaseUtilsService.fetchObjects(this.getClassName(), { id: objectId });
			if (!dataToSetActive) throw new Error(EnumErrors.ERROR_PERMISSION);

			const updatedData = { ...dataToSetActive, active, updatedBy: requesterId };
			const result = await this.fireBaseUtilsService.updateObject(this.getClassName(), objectId, updatedData);
			return result !== null;
		} catch (error) {
			console.error(`Error setting active status of ${this.getClassName()} with ID ${objectId}:`, error);
			throw error;
		}
	}

	async createClient(data: Partial<T>, createdBy: string): Promise<T> {
		try {
			const authorizedClass = ['Lot', 'FicheDescriptive', 'PropositionAchat', 'RDV'];

			if (authorizedClass.includes(this.getClassName())) {
				throw new Error(EnumErrors.ERROR_PERMISSION);
			}

			const dataToInsert = { ...data, createdById: createdBy };
			const result = await this.fireBaseUtilsService.createObject(this.getClassName(), dataToInsert);
			if (!result) {
				console.error(`Error creating ${this.getClassName()}:`, result);
				throw new Error(EnumErrors.ERROR_UNKNOWN);
			}
			return result as unknown as T;
		} catch (error) {
			console.error(`Error creating ${this.getClassName()}:`, error);
			throw error;
		}
	}

	async createPartner(data: Partial<T>, createdBy: string): Promise<T | EnumErrors> {
		try {
			const authorizedClass = ['Lot', 'FicheDescriptive', 'AdresseStockage'];

			if (authorizedClass.includes(this.getClassName())) {
				throw new Error(EnumErrors.ERROR_PERMISSION);
			}

			const dataToInsert = { ...data, createdBy };
			const result = await this.fireBaseUtilsService.createObject(this.getClassName(), dataToInsert);
			if (!result) {
				console.error(`Error creating ${this.getClassName()}:`, result);
				throw new Error(EnumErrors.ERROR_UNKNOWN);
			}
			return result as unknown as T;
		} catch (error) {
			console.error(`Error creating ${this.getClassName()}:`, error);
			throw error;
		}
	}

	async updateClient(objectId: string, data: Partial<T>, requesterId: string): Promise<boolean> {
		try {
			const dataToUpdate = await this.fireBaseUtilsService.fetchObjectById(this.getClassName(), objectId) as T;
			if (!dataToUpdate || !dataToUpdate.active) throw new Error(EnumErrors.ERROR_PERMISSION);

			const canUpdate = this.checkPermission(dataToUpdate, requesterId);
			if (!canUpdate) throw new Error(EnumErrors.ERROR_PERMISSION);

			const updatedData = { ...data, updatedBy: requesterId };
			const result = await this.fireBaseUtilsService.updateObject(this.getClassName(), objectId, updatedData);
			return result !== null;
		} catch (error) {
			console.error(`Error updating ${this.getClassName()} with ID ${objectId}:`, error);
			throw error;
		}
	}

	async getClient(objectId: string): Promise<Partial<T>> {
		try {
			const data = await this.fireBaseUtilsService.fetchObjectById(this.getClassName(), objectId) as T;

			if (!data || !data.active) throw new Error(EnumErrors.ERROR_PERMISSION);

			return data as T;
		} catch (error) {
			console.error(`Error getting ${this.getClassName()} with ID ${objectId}:`, error);
			throw error;
		}
	}

	async disableClient(objectId: string, requesterId: string): Promise<boolean> {
		try {
			const dataToDisable = await this.fireBaseUtilsService.fetchObjectById(this.getClassName(), objectId) as T;
			if (!dataToDisable || !dataToDisable.active) throw new Error(EnumErrors.ERROR_PERMISSION);

			const canDisable = this.checkPermission(dataToDisable, requesterId);
			if (!canDisable) throw new Error(EnumErrors.ERROR_PERMISSION);

			const updatedData = { ...dataToDisable, active: false, updatedBy: requesterId };
			const result = await this.fireBaseUtilsService.updateObject(this.getClassName(), objectId, updatedData);
			return result !== null;
		} catch (error) {
			console.error(`Error disabling ${this.getClassName()} with ID ${objectId}:`, error);
			throw error;
		}
	}




	private checkPermission(data: Partial<T>, requesterId: string): boolean {
		return requesterId === data["createdBy"];
	}

	protected async checkAdminPermission(requesterId: string): Promise<boolean> {
		try {
			const contact = await this.fireBaseUtilsService.fetchObjectById('Contact', requesterId);

			if (!contact) {
				return false;
			}

			return true;
		} catch (e) {
			return false;
		}
	}

	protected combineResults<T>(resultsArray: FetchPageResult<T>[]): FetchPageResult<T> {
		const combinedResults = resultsArray.reduce<T[]>((acc, result) => acc.concat(result.data || []), []);
		const uniqueResults = Array.from(new Map(combinedResults.map(item => [this.getUniqueId(item), item])).values());
		const totalCount = resultsArray.reduce((acc, result) => acc + result.total, 0) -
			resultsArray.reduce((acc, result) => Math.abs(acc - result.total), 0);
		const count = uniqueResults.length;

		return {
			data: uniqueResults,
			total: totalCount,
			count: count
		};
	}

	protected getUniqueId(item: any): string {
		return item.id;
	}
}
