import { Prisma } from '@prisma/client';

import { prisma } from '../../db/prisma';
import { ApiError } from '../../utils/ApiError';

export const productSelect = {
  id: true,
  name: true,
  sku: true,
  category: true,
  unitPrice: true,
  currentStock: true,
  minStockAlert: true,
  warehouse: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductSelect;

const sortFieldMap = {
  createdAt: 'createdAt',
  name: 'name',
  sku: 'sku',
  category: 'category',
  currentStock: 'currentStock',
} as const;

export const listProducts = async (query: {
  search?: string;
  category?: string;
  lowStock?: boolean;
  isActive?: boolean;
  page: number;
  limit: number;
  sortBy: keyof typeof sortFieldMap;
  sortOrder: 'asc' | 'desc';
}) => {
  const where: Prisma.ProductWhereInput = {
    ...(query.category ? { category: { equals: query.category } } : {}),
    ...(typeof query.isActive === 'boolean' ? { isActive: query.isActive } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { sku: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  if (query.lowStock) {
    const allMatches = await prisma.product.findMany({
      where,
      orderBy: { [sortFieldMap[query.sortBy]]: query.sortOrder },
      select: productSelect,
    });

    const lowStockProducts = allMatches.filter((product) => product.currentStock <= product.minStockAlert);
    const total = lowStockProducts.length;
    const data = lowStockProducts.slice((query.page - 1) * query.limit, query.page * query.limit);

    return {
      data,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  }

  const [total, data] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { [sortFieldMap[query.sortBy]]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: productSelect,
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

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: productSelect,
  });

  if (!product) {
    throw new ApiError(404, 'NOT_FOUND', 'Product not found');
  }

  return product;
};

export const createProduct = async (data: Prisma.ProductCreateInput) => {
  return prisma.product.create({
    data,
    select: productSelect,
  });
};

export const updateProduct = async (id: string, data: Prisma.ProductUpdateInput) => {
  const existing = await prisma.product.findUnique({ where: { id }, select: { id: true } });

  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Product not found');
  }

  return prisma.product.update({
    where: { id },
    data,
    select: productSelect,
  });
};
