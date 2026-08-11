import { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate';
import { requireRole } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { adjustInventoryHandler, listMovementsHandler, summaryHandler } from './inventory.controller';
import { inventoryAdjustSchema, inventoryMovementListQuerySchema, inventorySummaryQuerySchema } from './inventory.validation';

export const inventoryRouter = Router();

inventoryRouter.use(authenticate);

inventoryRouter.get('/movements', requireRole('ADMIN', 'WAREHOUSE', 'ACCOUNTS'), validate(inventoryMovementListQuerySchema, 'query'), listMovementsHandler);
inventoryRouter.post('/adjust', requireRole('ADMIN', 'WAREHOUSE'), validate(inventoryAdjustSchema), adjustInventoryHandler);
inventoryRouter.get('/summary', requireRole('ADMIN', 'WAREHOUSE', 'ACCOUNTS'), validate(inventorySummaryQuerySchema, 'query'), summaryHandler);
