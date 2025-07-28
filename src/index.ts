import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export enum NisixErrorCode {
  UnknownError = 'UnknownError',
  Unauthenticated = 'Unauthenticated',
  NotFound = 'NotFound',
  BadRequest = 'BadRequest',
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  InternalServerError = 'InternalServerError',
  ServiceUnavailable = 'ServiceUnavailable',
  GatewayTimeout = 'GatewayTimeout',
  BadGateway = 'BadGateway',
}

export class NisixError extends Error {
  public status: number;
  public metaData: any;
  constructor(code: string = NisixErrorCode.UnknownError, status: number = 500, metaData: any = null) {
    super(code);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = code;
    this.status = status;
    this.metaData = metaData;
    switch (code) {
      case NisixErrorCode.Unauthenticated:
        this.status = 401;
        break;
      case NisixErrorCode.BadRequest:
        this.status = 400;
        break;
      case NisixErrorCode.Unauthorized:
        this.status = 403;
        break;
      case NisixErrorCode.NotFound:
        this.status = 404;
        break;
      case NisixErrorCode.ServiceUnavailable:
        this.status = 503;
        break;
      case NisixErrorCode.GatewayTimeout:
        this.status = 504;
        break;
      default:
        this.status = 500;
        break;
    }
  }
}

interface NisixErrorHandlerOptions {
  debug?: boolean;
}

export interface NisixErrorResponse {
  status: number;
  message: string;
  stack?: string;
}

const nisixErrorHandler = (options: NisixErrorHandlerOptions = {}): ErrorRequestHandler => {
  return (err: any, req: Request, res: Response, next: NextFunction): void => {
    const status: number = err.status || err.statusCode || 500;
    const message: string = err.message || 'Internal Server Error';
    const debug: boolean = options.debug ?? process.env.NODE_ENV !== 'production';

    if (err instanceof NisixError) {
      console.log('Error is known.');
      res.status(err.status).send({ status, message: err.message, ...(debug && { stack: err.stack }) });
    } else {
      const response: NisixErrorResponse = {
        status,
        message,
        ...(debug && { stack: err.stack }),
      };

      res.status(status).json({ error: response });
    }
  };
};

export default nisixErrorHandler;
