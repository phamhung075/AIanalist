import { HttpStatusCode } from '@/_core/helper/http-status/common/HttpStatusCode';
import { RestHandler } from '@/_core/helper/http-status/common/RestHandler';
import _ERROR from '@/_core/helper/http-status/error';
import { CustomRequest } from '@/_core/helper/interfaces/CustomRequest.interface';
import { FetchPageResult, PaginationOptions } from '@/_core/helper/interfaces/FetchPageResult.interface';
import { NextFunction, Response } from 'express';
import { Service } from 'typedi';
import { BaseService } from './BaseService';

/**
 * Generic Controller Class for CRUD and Pagination Operations
 */
@Service()
export abstract class BaseController<
    T extends CreateDTO & { id?: string },
    CreateDTO,
    UpdateDTO
> {
    protected service: BaseService<T>;

    constructor(service: BaseService<T>) {
        this.service = service;
    }

    async create(req: CustomRequest<CreateDTO>, res: Response, _next: NextFunction) {
        try {
            const inputData: CreateDTO = req.body;

            const entity = await this.service.create(inputData as Omit<T, 'id'>);

            if (!entity) {
                throw new _ERROR.BadRequestError({
                    message: 'Creation failed',
                });
            }

            return RestHandler.success(req, res, {
                code: HttpStatusCode.CREATED,
                message: 'Entity created successfully',
                data: entity,
                startTime: req.startTime,
            });
        } catch (error) {
            _next(error);
        }
    }
    

    /**
     * ✅ Get all entities
     */
    async getAll(req: CustomRequest, res: Response, _next: NextFunction) {
        try {
            const entities = await this.service.getAll();

            if (!entities || entities.length === 0) {
                throw new _ERROR.NotFoundError({
                    message: 'No entities found',
                });
            }

            return RestHandler.success(req, res, {
                code: HttpStatusCode.OK,
                message: 'Fetched all entities successfully',
                data: entities,
                startTime: req.startTime,
            });
        } catch (error) {
            _next(error);
        }
    }

    /**
     * ✅ Get entity by ID
     */
    async getById(req: CustomRequest, res: Response, _next: NextFunction) {
        try {
            const { id } = req.params;
            const entity = await this.service.getById(id);

            if (!entity) {
                throw new _ERROR.NotFoundError({
                    message: 'Entity not found',
                });
            }

            return RestHandler.success(req, res, {
                code: HttpStatusCode.OK,
                message: 'Fetched entity by ID successfully',
                data: entity,
                startTime: req.startTime,
            });
        } catch (error) {
            _next(error);
        }
    }

    /**
     * ✅ Update an entity by ID
     */
    async update(req: CustomRequest<UpdateDTO>, res: Response, _next: NextFunction) {
        try {
            const { id } = req.params;
            const inputData: UpdateDTO = req.body;
    
            const entity = await this.service.update(id, inputData as unknown as Partial<T>);
    
            if (!entity) {
                throw new _ERROR.NotFoundError({
                    message: 'Entity not found',
                });
            }
    
            return RestHandler.success(req, res, {
                code: HttpStatusCode.OK,
                message: 'Entity updated successfully',
                data: entity as unknown as UpdateDTO,
                startTime: req.startTime,
            });
        } catch (error) {
            _next(error);
        }
    }
    
    
    
    
    

    /**
     * ✅ Delete an entity by ID
     */
    async delete(req: CustomRequest, res: Response, _next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await this.service.delete(id);

            if (!result) {
                throw new _ERROR.NotFoundError({
                    message: 'Entity not found',
                });
            }

            return RestHandler.success(req, res, {
                code: HttpStatusCode.OK,
                message: 'Entity deleted successfully',
                startTime: req.startTime,
            });
        } catch (error) {
            _next(error);
        }
    }

    /**
     * ✅ Paginated Query
     */
    async paginator(req: CustomRequest, res: Response, _next: NextFunction) {
        try {
            const { page = '1', limit = '10', all = 'false' } = req.query;
            const options: PaginationOptions = {
                page: Number(page),
                limit: Number(limit),
                all: all === 'true',
            };

            const paginationResult: FetchPageResult<T> = await this.service.paginator(options);

            return RestHandler.success(req, res, {
                code: HttpStatusCode.OK,
                message: 'Fetched paginated entities successfully',
                data: paginationResult,
                startTime: req.startTime,
            });
        } catch (error) {
            _next(error);
        }
    }
}
