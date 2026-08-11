import { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import { loginHandler, meHandler } from './auth.controller';
import { loginSchema } from './auth.validation';

export const authRouter = Router();

authRouter.post('/login', validate(loginSchema), loginHandler);
authRouter.get('/me', authenticate, meHandler);
