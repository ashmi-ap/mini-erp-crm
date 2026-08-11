import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/asyncHandler';
import { sendData } from '../../utils/response';
import { createCustomer, getCustomerById, listCustomers, updateCustomer } from './customer.service';

export const listCustomersHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = res.locals.validated?.query as Parameters<typeof listCustomers>[0];
  const result = await listCustomers(query);
  res.json(result);
});

export const getCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const params = res.locals.validated?.params as { id: string };
  const customer = await getCustomerById(params.id);
  sendData(res, customer);
});

export const createCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const body = res.locals.validated?.body as Parameters<typeof createCustomer>[0];
  const customer = await createCustomer(body as never);
  sendData(res, customer, 201);
});

export const updateCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const params = res.locals.validated?.params as { id: string };
  const body = res.locals.validated?.body as Parameters<typeof updateCustomer>[1];
  const customer = await updateCustomer(params.id, body as never);
  sendData(res, customer);
});
