// error.service.ts
import ErrorRepository from './error.repository';
import { IError } from './error.interface';

class ErrorService {
  constructor(private errorRepository: ErrorRepository) {}

  async logError(message: string, stack?: string, statusCode: number = 500): Promise<IError> {
    const error: IError = {
      message,
      stack,
      statusCode,
      timestamp: new Date(),
    };

    return this.errorRepository.create(error);
  }

  async getAllErrors(): Promise<IError[]> {
    return this.errorRepository.findAll();
  }

  async getErrorById(id: string): Promise<IError | undefined> {
    return this.errorRepository.findById(id);
  }
}

export default ErrorService;
