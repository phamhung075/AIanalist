// error.repository.ts
import { IError } from './error.interface';

// Simulated in-memory database
const errorDatabase: IError[] = [];

class ErrorRepository {
  async create(error: IError): Promise<IError> {
    const newError = { ...error, id: Date.now().toString() };
    // errorDatabase.push(newError);
    
    return newError;
  }

  async findAll(): Promise<IError[]> {
    return errorDatabase;
  }

  async findById(id: string): Promise<IError | undefined> {
    return errorDatabase.find((error) => error.id === id);
  }
}

export default ErrorRepository;
