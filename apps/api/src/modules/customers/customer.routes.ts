import { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import {
  createCustomerHandler,
  getCustomerHandler,
  listCustomersHandler,
  updateCustomerHandler,
} from './customer.controller';
import { customerCreateSchema, customerIdParamSchema, customerListQuerySchema, customerUpdateSchema } from './customer.validation';

export const customerRouter = Router();

customerRouter.use(authenticate);

customerRouter.get('/', validate(customerListQuerySchema, 'query'), listCustomersHandler);
customerRouter.get('/:id', validate(customerIdParamSchema, 'params'), getCustomerHandler);
customerRouter.post('/', requireRole('ADMIN', 'SALES'), validate(customerCreateSchema), createCustomerHandler);
customerRouter.patch('/:id', requireRole('ADMIN', 'SALES'), validate(customerIdParamSchema, 'params'), validate(customerUpdateSchema), updateCustomerHandler);
