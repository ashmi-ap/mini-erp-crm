import { Prisma } from '@prisma/client';

import { prisma } from '../../db/prisma';
import { ApiError } from '../../utils/ApiError';

export const customerSelect = {
  id: true,
  name: true,
  mobile: true,
  email: true,
  businessName: true,
  gstNumber: true,
  customerType: true,
  address: true,
  status: true,
  followUpDate: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CustomerSelect;

const sortFieldMap = {
  createdAt: 'createdAt',
  name: 'name',
  followUpDate: 'followUpDate',
} as const;

export const listCustomers = async (query: {
  search?: string;
  status?: string;
  customerType?: string;
  page: number;
  limit: number;
  sortBy: keyof typeof sortFieldMap;
  sortOrder: 'asc' | 'desc';
}) => {
  const where: Prisma.CustomerWhereInput = {
    ...(query.status ? { status: query.status as Prisma.EnumCustomerStatusFilter['equals'] } : {}),
    ...(query.customerType ? { customerType: query.customerType as Prisma.EnumCustomerTypeFilter['equals'] } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { mobile: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
            { businessName: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [total, data] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      orderBy: { [sortFieldMap[query.sortBy]]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: customerSelect,
    }),
  ]);

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
};

export const getCustomerById = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    select: {
      ...customerSelect,
      _count: {
        select: {
          challans: true,
        },
      },
    },
  });

  if (!customer) {
    throw new ApiError(404, 'NOT_FOUND', 'Customer not found');
  }

  return {
    ...customer,
    challanCount: customer._count.challans,
  };
};

export const createCustomer = async (data: Prisma.CustomerCreateInput) => {
  return prisma.customer.create({
    data,
    select: customerSelect,
  });
};

export const updateCustomer = async (id: string, data: Prisma.CustomerUpdateInput) => {
  const existing = await prisma.customer.findUnique({ where: { id }, select: { id: true } });

  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Customer not found');
  }

  return prisma.customer.update({
    where: { id },
    data,
    select: customerSelect,
  });
};
