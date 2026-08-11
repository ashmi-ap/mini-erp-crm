import { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import {
  createProductHandler,
  getProductHandler,
  listProductsHandler,
  updateProductHandler,
} from './product.controller';
import { productCreateSchema, productIdParamSchema, productListQuerySchema, productUpdateSchema } from './product.validation';

export const productRouter = Router();

productRouter.use(authenticate);

productRouter.get('/', validate(productListQuerySchema, 'query'), listProductsHandler);
productRouter.get('/:id', validate(productIdParamSchema, 'params'), getProductHandler);
productRouter.post('/', requireRole('ADMIN', 'WAREHOUSE'), validate(productCreateSchema), createProductHandler);
productRouter.patch('/:id', requireRole('ADMIN', 'WAREHOUSE'), validate(productIdParamSchema, 'params'), validate(productUpdateSchema), updateProductHandler);
