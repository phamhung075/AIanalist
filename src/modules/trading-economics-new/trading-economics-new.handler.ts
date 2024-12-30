import { validateDTO } from "@/_core/helper/validateZodSchema";
import { NextFunction, Request, Response } from 'express';
import { IdSchema, CreateSchema, UpdateSchema } from "./trading-economics-new.validation";
import { tradingEconomicsNewController } from "./trading-economics-new.module";


const validateCreateDTO = validateDTO(CreateSchema, 'body');
const validateIdDTO = validateDTO(IdSchema, 'body');
const validateUpdateDTO = validateDTO(UpdateSchema, 'body');

/**
 * Create Handler
 */
const createHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validation already happened in middleware
    await tradingEconomicsNewController.create(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Handler
 */
const getAllsHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    await tradingEconomicsNewController.getAll(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * Get By ID Handler
 */
const getByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await tradingEconomicsNewController.getById(req, res, next);
  } catch (error) {
    next(error);
  }
}

/**
 * Update Handler
 */
const updateHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await tradingEconomicsNewController.update(req, res, next);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete Handler
 */
const deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await tradingEconomicsNewController.delete(req, res, next);
  } catch (error) {
    next(error);
  }
}

export {
  validateCreateDTO,
  validateIdDTO,
  validateUpdateDTO,
  createHandler,
  deleteHandler,
  getAllsHandler,
  getByIdHandler,
  updateHandler
};
