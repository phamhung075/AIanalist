// contact.controller.ts
import { NextFunction, RequestHandler, Response } from 'express';
import _SUCCESS from '@/_core/helper/http-status/success';
import { RestHandler } from '@/_core/helper/http-status/common/RestHandler';
import { HttpStatusCode } from '@/_core/helper/http-status/common/HttpStatusCode';
import { AuthService } from './auth.service';
import { IAuth } from './auth.interface';
import { CustomRequest } from '../helper/interfaces/CustomRequest.interface';
import _ERROR from '../helper/http-status/error';

class AuthController {
  constructor(private authService: AuthService) { }

  register: RequestHandler = async (req: CustomRequest, res: Response, _next: NextFunction) => {

    const body = req.body;
    const inputData: IAuth = {
      email: body.email,
      password: body.password,
    };

    const account = await this.authService.register(inputData.email, inputData.password);

    return RestHandler.success(req, res, {
      code: HttpStatusCode.CREATED,
      message: 'User registered successfully',
      data: account,
    });
  }
};

export default AuthController;
