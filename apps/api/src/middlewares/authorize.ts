import type { NextFunction, Request, Response } from 'express';

import type { Role } from '../constants/domain';
import { ApiError } from '../utils/ApiError';

export const requireRole = (...allowedRoles: Role[]) => (req: Request, _res: Response, next: NextFunction) => {
  const role = req.user?.role;

  if (!role) {
    next(new ApiError(401, 'UNAUTHENTICATED', 'Authentication required'));
    return;
  }

  if (!allowedRoles.includes(role)) {
    next(new ApiError(403, 'FORBIDDEN', 'You do not have permission to access this resource'));
    return;
  }

  next();
};
