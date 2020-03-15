import {Request, Response, NextFunction, RequestHandler} from 'express';
import {IError} from './errorMiddleware';
import Joi from '@hapi/joi';

export const validator = function(schema: Joi.ObjectSchema): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction) {
    const errors = schema.validate(req.body, {abortEarly: false}).error;

    if (errors) {
      const error: IError = new Error('Validation error');
      error.statusCode = 422;
      error.data = [];
      errors.details.forEach((e) => {
        if (error.data) {
          error.data.push(e.message);
        }
      });
      next(error);
    }

    next();
  };
};
