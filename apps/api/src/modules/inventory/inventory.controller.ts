import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/asyncHandler';
import { sendData } from '../../utils/response';
import { adjustInventory, getInventorySummary, listMovements } from './inventory.service';

export const adjustInventoryHandler = asyncHandler(async (_req: Request, res: Response) => {
  const body = res.locals.validated?.body as { productId: string; type: 'IN' | 'OUT'; quantity: number; reason: string };
  const result = await adjustInventory(res.locals.authUserId as string, body);
  sendData(res, result, 201);
});

export const listMovementsHandler = asyncHandler(async (_req: Request, res: Response) => {
  const query = res.locals.validated?.query as Parameters<typeof listMovements>[0];
  const result = await listMovements(query);
  res.json(result);
});

export const summaryHandler = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await getInventorySummary();
  sendData(res, summary);
});
