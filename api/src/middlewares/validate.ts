import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '../helpers/responseHandler';

type Source = 'body' | 'query' | 'params';

export const validate =
  (schema: Joi.ObjectSchema, source: Source = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });
    if (error) {
      return next(
        new ApiError({
          message: error.details.map((d) => d.message).join('; '),
          responseStatus: 400,
        }),
      );
    }
    (req as any)[source] = value;
    next();
  };
