import _SUCCESS from '@/_core/helper/http-status/success';
import { RequestHandler, Response } from 'express';
import _ERROR from '../helper/http-status/error';
import { CustomRequest } from '../helper/interfaces/CustomRequest.interface';
import { AuthService } from './auth.service';
import { IAuth, IRegister } from './auth.interface';

class AuthController {
  constructor(
    private authService: AuthService,
  ) {
  }

  register: RequestHandler = async (req: CustomRequest, res: Response) => {
    const body = req.body as IRegister;
    const result = await this.authService.register(body);
    new _SUCCESS.CreatedSuccess({
      message: 'User registered successfully',
      data: result
    })
      .setResponseTime(req.startTime)
      .send(res);
  }

  login: RequestHandler = async (req: CustomRequest, res: Response) => {
    const { email, password } = req.body as IAuth;
    const result = await this.authService.login(email, password);
    new _SUCCESS.OkSuccess({
      message: 'User logged in successfully',
      data: result
    })
      .setResponseTime(req.startTime)
      .send(res);
  }

  getCurrentUser: RequestHandler = async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      throw new _ERROR.UnauthorizedError({
        message: 'Unauthorized: No user found'
      });
    }
    const result = await this.authService.getUser(req.user.uid);
    new _SUCCESS.OkSuccess({
      message: 'User fetched successfully',
      data: result
    })
      .setResponseTime(req.startTime)
      .send(res);
  }

  verifyToken: RequestHandler = async (req: CustomRequest, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1] || '';
    const result = await this.authService.verifyToken(token);
    new _SUCCESS.OkSuccess({
      message: 'Token verified successfully',
      data: result
    })
      .setResponseTime(req.startTime)
      .send(res);
  }
}

export default AuthController;