import type { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { z } from 'zod';

import { env } from '../config/env';
import type { Role } from '../constants/domain';
import { ApiError } from '../utils/ApiError';

const authTokenSchema = z.string().regex(/^Bearer\s+.+$/, 'Authorization header must use Bearer token');

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new ApiError(401, 'UNAUTHENTICATED', 'Authentication required');
    }

    const validatedHeader = authTokenSchema.safeParse(authorizationHeader);

    if (!validatedHeader.success) {
      throw new ApiError(401, 'UNAUTHENTICATED', 'Authentication required');
    }

    const token = authorizationHeader.slice('Bearer '.length).trim();
    const decoded = jwt.verify(token, env.jwtSecret) as { userId?: string; role?: string };

    if (!decoded.userId || !decoded.role) {
      throw new ApiError(401, 'UNAUTHENTICATED', 'Authentication required');
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role as Role,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      next(new ApiError(401, 'UNAUTHENTICATED', 'Authentication required'));
      return;
    }

    if (error instanceof ApiError) {
      next(error);
      return;
    }

    next(new ApiError(401, 'UNAUTHENTICATED', 'Authentication required'));
  }
};
