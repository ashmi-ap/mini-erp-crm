import { z } from 'zod';

import { challanStatuses } from '../../constants/domain';

const optionalDate = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsedDate = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(parsedDate.getTime()) ? value : parsedDate;
}, z.date().optional());

const itemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().positive(),
}).strict();

export const challanIdParamSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const challanListQuerySchema = z.object({
  status: z.enum(challanStatuses).optional(),
  customerId: z.string().uuid().optional(),
  search: z.string().trim().min(1).optional(),
  from: optionalDate,
  to: optionalDate,
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'confirmedAt', 'challanNumber']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
}).strict();

export const challanCreateSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(itemSchema).min(1),
}).strict();

export const challanUpdateSchema = z.object({
  customerId: z.string().uuid().optional(),
  items: z.array(itemSchema).min(1).optional(),
}).strict();
