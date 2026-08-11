import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { ApiError } from '../utils/ApiError';

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details ?? null,
      },
    });
    return;
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = Array.isArray(error.meta?.target) ? error.meta?.target : undefined;
      res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'Resource already exists',
          details: target ? { fields: target } : null,
        },
      });
      return;
    }

    if (error.code === 'P2025') {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Resource not found',
          details: null,
        },
      });
      return;
    }
  }

  if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
    res.status(401).json({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication required',
        details: null,
      },
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: null,
    },
  });
};
