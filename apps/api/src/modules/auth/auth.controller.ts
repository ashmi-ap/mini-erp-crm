import type { Request, Response } from 'express';

import { login, getCurrentUser } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendData } from '../../utils/response';

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const body = res.locals.validated?.body as { email: string; password: string };
  const result = await login(body.email, body.password);
  res.json(result);
});

export const meHandler = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = await getCurrentUser(req.user!.userId);
  sendData(res, currentUser);
});
