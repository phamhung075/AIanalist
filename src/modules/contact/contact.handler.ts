import { validateDTO } from "@/_core/helper/validateZodSchema";
import { NextFunction, Request, Response } from 'express';
import { contactController } from "./contact.module";
import { IdSchema, CreateSchema, UpdateSchema } from "./contact.validation";


const validateCreateDTO = validateDTO(CreateSchema, 'body');
const validateIdDTO = validateDTO(IdSchema, 'body');
const validateUpdateDTO = validateDTO(UpdateSchema, 'body');
/**
 * Create Handler
 */
const createHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validation already happened in middleware
    await contactController.create(req, res, next);
  } catch (error) {
    next(error);
  }
};



/**
 * Get All Handler
 */
const getAllsHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    await contactController.getAll(req, res, next);
  } catch (error) {
    next(error);
  }
};



/**
 * Get By ID Handler
 */
const getByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await contactController.getById(req, res, next);
  } catch (error) {
    next(error);
  }
}


/**
 * Update Handler
 */
const updateHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await contactController.update(req, res, next);
  } catch (error) {
    next(error);
  }
}


/**
 * Delete Handler
 */
const deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await contactController.delete(req, res, next);
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
