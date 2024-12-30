// contact.controller.ts
import { NextFunction, RequestHandler, Response } from 'express';
import _SUCCESS from '@/_core/helper/http-status/success';
import { RestHandler } from '@/_core/helper/http-status/common/RestHandler';
import { HttpStatusCode } from '@/_core/helper/http-status/common/HttpStatusCode';
import { AuthService } from './auth.service';
import { IAuth } from './auth.interface';
import { CustomRequest } from '../helper/interfaces/CustomRequest.interface';

class AuthController {
  constructor(private authService: AuthService) { }

  register: RequestHandler = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    const body = req.body;
    const inputData = {
        email: body.email,
        password: body.password,   
    } as IAuth
    const account = await this.authService.register(inputData.email, inputData.password);
    if (!account) {
      return RestHandler.error(req, res, {
        code: HttpStatusCode.BAD_REQUEST,
        message: "User registration failed"
      });
    }
    const message = '';
    return RestHandler.success(req, res, {
      code: HttpStatusCode.CREATED,
      message,
      data: account
    });
  }

}

export default AuthController;
