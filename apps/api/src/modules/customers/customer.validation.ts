import { z } from 'zod';

import { customerStatuses, customerTypes } from '../../constants/domain';

const optionalDate = z.union([z.string().datetime(), z.date()]).optional().nullable().transform((value) => {
  if (!value) {
    return value ?? null;
  }

  return value instanceof Date ? value : new Date(value);
});

export const customerIdParamSchema = z.object({
  id: z.string().uuid(),
}).strict();

export const customerListQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  status: z.enum(customerStatuses).optional(),
  customerType: z.enum(customerTypes).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'name', 'followUpDate']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
}).strict();

const customerBaseSchema = z.object({
  name: z.string().trim().min(1),
  mobile: z.string().trim().regex(/^[0-9+()\-\s]{7,20}$/, 'Mobile number is invalid'),
  email: z.string().trim().email().optional().or(z.literal('')).transform((value) => value || undefined),
  businessName: z.string().trim().optional().or(z.literal('')).transform((value) => value || undefined),
  gstNumber: z.string().trim().optional().or(z.literal('')).transform((value) => value || undefined),
  address: z.string().trim().optional().or(z.literal('')).transform((value) => value || undefined),
  followUpDate: optionalDate,
  notes: z.string().trim().optional().or(z.literal('')).transform((value) => value || undefined),
  customerType: z.enum(customerTypes),
  status: z.enum(customerStatuses),
});

export const customerCreateSchema = customerBaseSchema.strict();
export const customerUpdateSchema = customerBaseSchema.partial().strict();
