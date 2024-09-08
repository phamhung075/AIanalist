export interface FetchPageResult<T> {
	data: T[] | undefined | any[];
	total: number;
	count: number;
	page?: number;
	totalPages?: number;
	limit?: number;
}
