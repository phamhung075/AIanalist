// firebase.controller.ts
import { CustomRequest } from '@/_core/guard/handle-permission/CustomRequest.interface';
import { NextFunction, RequestHandler, Response } from 'express';
import { IFirebase } from './firebase.interface';
import FirebaseService from './firebase.service';
import _SUCCESS from '@/_core/helper/http-status/success';
import { RestHandler } from '@/_core/helper/http-status/common/RestHandler';
import { HttpStatusCode } from '@/_core/helper/http-status/common/HttpStatusCode';

class FirebaseController {
  constructor(private firebaseService: FirebaseService) { }

  createFirebase: RequestHandler = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    const body = req.body;
    const inputData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
    } as IFirebase
    const firebase = await this.firebaseService.createFirebase(inputData);
    if (!firebase) {
      return RestHandler.error(req, res, {
        code: HttpStatusCode.BAD_REQUEST,
        message: 'Firebase creation failed'
      });
    }
    const message = 'Firebase created successfully';
    // return new _SUCCESS.SuccessResponse({ message, data: firebase }).send(res);
    return RestHandler.success(req, res, {
      code: HttpStatusCode.CREATED,
      message,
      data: firebase
    });
  }

  getAllFirebases = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    const firebases = await this.firebaseService.getAllFirebases();
    const message = 'Get all firebases successfully';

    if (!firebases || firebases.length === 0) {
      return RestHandler.success(req, res, {
        code: HttpStatusCode.NO_CONTENT,
        message,
        data: [],
      });
    }

    return RestHandler.success(req, res, {
      code: HttpStatusCode.OK,
      message,
      data: firebases,
    });
  };

  getFirebaseById = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    const firebase = await this.firebaseService.getFirebaseById(req.params.id);
    if (!firebase) {
      return RestHandler.error(req, res, {
        code: HttpStatusCode.NOT_FOUND,
        message: 'Firebase not found',
      });
    }
    const message = firebase
      ? 'Get firebase by id successfully'
      : 'Firebase not found';

    return RestHandler.success(req, res, {
      code: firebase ? HttpStatusCode.OK : HttpStatusCode.NOT_FOUND,
      message,
      data: firebase, // Ensure data is undefined if firebase is null
    });
  };

  updateFirebase = async (req: CustomRequest, res: Response, _next: NextFunction) => {

    const { name, email, phone, message } = req.body;

    const inputData: Partial<IFirebase> = {
      name,
      email,
      phone,
      message,
    };

    const firebase = await this.firebaseService.updateFirebase(req.params.id, inputData);

    if (!firebase) {
      return RestHandler.error(req, res, {
        code: HttpStatusCode.NOT_FOUND,
        message: 'Firebase not found',
      });
    }

    const messageSuccess = 'Update firebase successfully';

    return RestHandler.success(req, res, {
      code: HttpStatusCode.OK,
      message: messageSuccess,
      data: firebase,
    });
  };


  deleteFirebase = async (req: CustomRequest, res: Response, _next: NextFunction) => {
    const result = await this.firebaseService.deleteFirebase(req.params.id);

    if (!result) {
      return RestHandler.error(req, res, {
        code: HttpStatusCode.NOT_FOUND,
        message: 'Firebase not found',
      });
    }

    const message = 'Delete firebase successfully';

    return RestHandler.success(req, res, {
      code: HttpStatusCode.OK,
      message,
    });
  };
}

export default FirebaseController;
