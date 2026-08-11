import { z } from 'zod';

const optionalBooleanQuery = z.preprocess((value) => {
  if (value === undefined) {
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

export const productIdParamSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const productListQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  lowStock: optionalBooleanQuery,
  isActive: optionalBooleanQuery,
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'name', 'sku', 'category', 'currentStock']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
}).strict();

const optionalBoolean = z.boolean().optional();

export const productCreateSchema = z.object({
  name: z.string().trim().min(1),
  sku: z.string().trim().min(1),
  category: z.string().trim().min(1),
  unitPrice: z.coerce.number().positive(),
  currentStock: z.coerce.number().int().min(0).optional().default(0),
  minStockAlert: z.coerce.number().int().min(0).optional().default(0),
  warehouse: z.string().trim().min(1),
  isActive: optionalBoolean.default(true),
}).strict();

export const productUpdateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  unitPrice: z.coerce.number().positive().optional(),
  minStockAlert: z.coerce.number().int().min(0).optional(),
  warehouse: z.string().trim().min(1).optional(),
  isActive: z.boolean().optional(),
}).strict();
