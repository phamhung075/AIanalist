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
    try {
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
    } catch (error: any) {
      console.error('❌ Controller Registration Error:', error.message);

      if (error.message === 'Email is already in use') {
        return RestHandler.error(req, res, {
          code: HttpStatusCode.CONFLICT,
          message: error.message,
        });
      }
      if (error.message === 'Invalid email format') {
        return RestHandler.error(req, res, {
          code: HttpStatusCode.BAD_REQUEST,
          message: error.message,
        });
      }
      if (error.message === 'Password is too weak') {
        return RestHandler.error(req, res, {
          code: HttpStatusCode.BAD_REQUEST,
          message: error.message,
        });
      }     
    }
  };
}



export default AuthController;
