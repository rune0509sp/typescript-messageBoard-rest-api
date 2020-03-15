import {Request, Response, NextFunction} from 'express';

export type IError = Error & {
  statusCode?: number,
  data?: string[];
}

export const errorMiddleware = (
  error: IError,
  req: Request,
  res: Response,
  next: NextFunction) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  if (process.env.NODE_ENV == 'development' ||
    process.env.NODE_ENV == 'test') {
    console.log(error);
  }
  res.status(status).json({
    message,
    data,
  });
};
