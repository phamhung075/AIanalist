// error.interface.ts
export interface IError {
    id?: string;
    message: string;
    stack?: string;
    statusCode: number;
    timestamp: Date;
  }