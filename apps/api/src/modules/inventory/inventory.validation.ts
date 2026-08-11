import { z } from 'zod';

import { movementTypes } from '../../constants/domain';

const optionalDate = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsedDate = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(parsedDate.getTime()) ? value : parsedDate;
}, z.date().optional());

const optionalBooleanQuery = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return value;
}, z.boolean().optional());

export const inventoryAdjustSchema = z.object({
  productId: z.string().uuid(),
  type: z.enum(movementTypes),
  quantity: z.coerce.number().int().positive(),
  reason: z.string().trim().min(1),
}).strict();

export const inventoryMovementListQuerySchema = z.object({
  productId: z.string().uuid().optional(),
  type: z.enum(movementTypes).optional(),
  from: optionalDate,
  to: optionalDate,
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'quantity']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
}).strict();

export const inventorySummaryQuerySchema = z.object({}).strict();
