import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate =
  (schema: { body?: AnyZodObject; query?: AnyZodObject; params?: AnyZodObject }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) req.body = schema.body.parse(req.body);
      if (schema.query) req.query = schema.query.parse(req.query);
      if (schema.params) req.params = schema.params.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: '입력값 검증 실패',
          errors: error.flatten().fieldErrors,
        });
      }
      next(error);
    }
  };