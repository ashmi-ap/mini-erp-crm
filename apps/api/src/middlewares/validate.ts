import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

import { ApiError } from '../utils/ApiError';

type ValidateTarget = 'body' | 'query' | 'params';

export const validate = (schema: ZodTypeAny, target: ValidateTarget = 'body') => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req[target]);

  if (!result.success) {
    next(
      new ApiError(400, 'VALIDATION_ERROR', 'Invalid request', result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }))),
    );
    return;
  }

  const response = _res as Response & { locals: { validated?: Record<string, unknown> } };
  response.locals.validated = response.locals.validated ?? {};
  response.locals.validated[target] = result.data;
  next();
};
