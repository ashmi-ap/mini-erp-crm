import { Prisma } from '@prisma/client';

import { prisma } from '../../db/prisma';
import { ApiError } from '../../utils/ApiError';

const inventoryProductSelect = {
  id: true,
  name: true,
  sku: true,
  category: true,
  warehouse: true,
  currentStock: true,
  minStockAlert: true,
  isActive: true,
} satisfies Prisma.ProductSelect;

const inventoryMovementSelect = {
  id: true,
  type: true,
  quantity: true,
  reason: true,
  referenceChallanId: true,
  createdAt: true,
  product: {
    select: inventoryProductSelect,
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
} satisfies Prisma.StockMovementSelect;

const sortFieldMap = {
  createdAt: 'createdAt',
  quantity: 'quantity',
} as const;

export const adjustInventory = async (userId: string, data: { productId: string; type: 'IN' | 'OUT'; quantity: number; reason: string }) => {
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
    select: { id: true, currentStock: true, isActive: true, name: true, sku: true },
  });

  if (!product) {
    throw new ApiError(404, 'NOT_FOUND', 'Product not found');
  }

  if (!product.isActive) {
    throw new ApiError(409, 'PRODUCT_INACTIVE', 'Product is inactive');
  }

  return prisma.$transaction(async (tx) => {
    if (data.type === 'IN') {
      const updatedProduct = await tx.product.update({
        where: { id: product.id },
        data: { currentStock: { increment: data.quantity } },
        select: inventoryProductSelect,
      });

      const movement = await tx.stockMovement.create({
        data: {
          productId: product.id,
          type: 'IN',
          quantity: data.quantity,
          reason: data.reason,
          createdById: userId,
        },
        select: inventoryMovementSelect,
      });

      return { product: updatedProduct, movement };
    }

    const updated = await tx.product.updateMany({
      where: {
        id: product.id,
        isActive: true,
        currentStock: { gte: data.quantity },
      },
      data: { currentStock: { decrement: data.quantity } },
    });

    if (updated.count !== 1) {
      const latest = await tx.product.findUnique({
        where: { id: product.id },
        select: { currentStock: true },
      });

      throw new ApiError(409, 'INSUFFICIENT_STOCK', 'Insufficient stock for this product', {
        productId: product.id,
        requested: data.quantity,
        available: latest?.currentStock ?? 0,
      });
    }

    const movement = await tx.stockMovement.create({
      data: {
        productId: product.id,
        type: 'OUT',
        quantity: data.quantity,
        reason: data.reason,
        createdById: userId,
      },
      select: inventoryMovementSelect,
    });

    const updatedProduct = await tx.product.findUnique({
      where: { id: product.id },
      select: inventoryProductSelect,
    });

    return { product: updatedProduct, movement };
  });
};

export const listMovements = async (query: {
  productId?: string;
  type?: 'IN' | 'OUT';
  from?: Date;
  to?: Date;
  page: number;
  limit: number;
  sortBy: keyof typeof sortFieldMap;
  sortOrder: 'asc' | 'desc';
}) => {
  const where: Prisma.StockMovementWhereInput = {
    ...(query.productId ? { productId: query.productId } : {}),
    ...(query.type ? { type: query.type } : {}),
    ...(query.from || query.to ? { createdAt: { ...(query.from ? { gte: query.from } : {}), ...(query.to ? { lte: query.to } : {}) } } : {}),
  };

  const [total, data] = await Promise.all([
    prisma.stockMovement.count({ where }),
    prisma.stockMovement.findMany({
      where,
      orderBy: { [sortFieldMap[query.sortBy]]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: inventoryMovementSelect,
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

export const getInventorySummary = async () => {
  const [activeProducts, stockAggregate, recentMovements] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.aggregate({
      where: { isActive: true },
      _sum: { currentStock: true },
    }),
    prisma.stockMovement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: inventoryMovementSelect,
    }),
  ]);

  const activeProductStats = await prisma.product.findMany({
    where: { isActive: true },
    select: { currentStock: true, minStockAlert: true },
  });

  const lowStockCount = activeProductStats.filter((product) => product.currentStock <= product.minStockAlert).length;
  const outOfStockCount = activeProductStats.filter((product) => product.currentStock === 0).length;

  return {
    totalActiveProducts: activeProducts,
    totalStockUnits: stockAggregate._sum.currentStock ?? 0,
    lowStockProductCount: lowStockCount,
    outOfStockProductCount: outOfStockCount,
    recentMovements,
  };
};
