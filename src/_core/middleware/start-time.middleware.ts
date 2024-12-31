import { NextFunction, Response } from "express";
import { CustomRequest } from "../helper/interfaces/CustomRequest.interface";


export const startTimeAddOnRequest = (req: CustomRequest, _res: Response, next: NextFunction) => {
	req.startTime = Date.now();
	next();
}