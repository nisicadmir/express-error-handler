import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface ErrorHandlerOptions {
  debug?: boolean;
}

interface ErrorResponse {
  status: number;
  message: string;
  stack?: string;
}

const expressErrorHandler = (options: ErrorHandlerOptions = {}): ErrorRequestHandler => {
  return (err: any, req: Request, res: Response, next: NextFunction): void => {
    const status: number = err.status || err.statusCode || 500;
    const message: string = err.message || 'Internal Server Error';
    const debug: boolean = options.debug ?? process.env.NODE_ENV !== 'production';

    const response: ErrorResponse = {
      status,
      message,
      ...(debug && { stack: err.stack }),
    };

    res.status(status).json({ error: response });
  };
};

export default expressErrorHandler;
