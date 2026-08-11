import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/asyncHandler';
import { sendData } from '../../utils/response';
import { cancelChallan, confirmChallan, createChallan, getChallanById, listChallans, updateChallan } from './challan.service';

export const listChallansHandler = asyncHandler(async (_req: Request, res: Response) => {
  const query = res.locals.validated?.query as Parameters<typeof listChallans>[0];
  const result = await listChallans(query);
  res.json(result);
});

export const getChallanHandler = asyncHandler(async (_req: Request, res: Response) => {
  const params = res.locals.validated?.params as { id: string };
  const challan = await getChallanById(params.id);
  sendData(res, challan);
});

export const createChallanHandler = asyncHandler(async (_req: Request, res: Response) => {
  const body = res.locals.validated?.body as { customerId: string; items: Array<{ productId: string; quantity: number }> };
  const created = await createChallan(res.locals.authUserId as string, body);
  sendData(res, created, 201);
});

export const updateChallanHandler = asyncHandler(async (_req: Request, res: Response) => {
  const params = res.locals.validated?.params as { id: string };
  const body = res.locals.validated?.body as { customerId?: string; items?: Array<{ productId: string; quantity: number }> };
  const updated = await updateChallan(res.locals.authUserId as string, params.id, body);
  sendData(res, updated);
});

export const confirmChallanHandler = asyncHandler(async (_req: Request, res: Response) => {
  const params = res.locals.validated?.params as { id: string };
  const confirmed = await confirmChallan(res.locals.authUserId as string, params.id);
  sendData(res, confirmed);
});

export const cancelChallanHandler = asyncHandler(async (_req: Request, res: Response) => {
  const params = res.locals.validated?.params as { id: string };
  const cancelled = await cancelChallan(params.id);
  sendData(res, cancelled);
});
