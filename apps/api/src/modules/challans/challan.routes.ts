import { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import {
  cancelChallanHandler,
  confirmChallanHandler,
  createChallanHandler,
  getChallanHandler,
  listChallansHandler,
  updateChallanHandler,
} from './challan.controller';
import { challanCreateSchema, challanIdParamSchema, challanListQuerySchema, challanUpdateSchema } from './challan.validation';

export const challanRouter = Router();

challanRouter.use(authenticate);

challanRouter.get('/', validate(challanListQuerySchema, 'query'), listChallansHandler);
challanRouter.get('/:id', validate(challanIdParamSchema, 'params'), getChallanHandler);
challanRouter.post('/', requireRole('ADMIN', 'SALES'), validate(challanCreateSchema), createChallanHandler);
challanRouter.patch('/:id', requireRole('ADMIN', 'SALES'), validate(challanIdParamSchema, 'params'), validate(challanUpdateSchema), updateChallanHandler);
challanRouter.post('/:id/confirm', requireRole('ADMIN', 'SALES'), validate(challanIdParamSchema, 'params'), confirmChallanHandler);
challanRouter.post('/:id/cancel', requireRole('ADMIN', 'SALES'), validate(challanIdParamSchema, 'params'), cancelChallanHandler);
