import { Router } from 'express';

import { prisma } from '../db/prisma';
import { authRouter } from '../modules/auth/auth.routes';
import { customerRouter } from '../modules/customers/customer.routes';
import { productRouter } from '../modules/products/product.routes';

export const apiRouter = Router();

apiRouter.get('/health', async (_req, res) => {
  const health = {
    status: 'ok' as const,
    service: 'api',
    database: 'connected' as const,
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json(health);
  } catch {
    res.status(503).json({
      status: 'degraded',
      service: 'api',
      database: 'unavailable',
    });
  }
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/customers', customerRouter);
apiRouter.use('/products', productRouter);

