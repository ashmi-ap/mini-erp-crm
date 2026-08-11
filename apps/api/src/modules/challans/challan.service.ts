import { Prisma } from '@prisma/client';

import { prisma } from '../../db/prisma';
import { ApiError } from '../../utils/ApiError';

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} satisfies Prisma.UserSelect;

const safeCustomerSelect = {
  id: true,
  name: true,
  mobile: true,
  email: true,
  businessName: true,
  customerType: true,
  status: true,
} satisfies Prisma.CustomerSelect;

const safeProductSelect = {
  id: true,
  name: true,
  sku: true,
  category: true,
  unitPrice: true,
  currentStock: true,
  minStockAlert: true,
  isActive: true,
} satisfies Prisma.ProductSelect;

const challanItemSelect = {
  id: true,
  productId: true,
  productNameSnapshot: true,
  productSkuSnapshot: true,
  unitPriceSnapshot: true,
  quantity: true,
  lineTotal: true,
} satisfies Prisma.ChallanItemSelect;

const challanDetailSelect = {
  id: true,
  challanNumber: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  confirmedAt: true,
  customer: { select: safeCustomerSelect },
  createdBy: { select: safeUserSelect },
  items: { select: challanItemSelect },
} satisfies Prisma.ChallanSelect;

const challanListSelect = {
  id: true,
  challanNumber: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  confirmedAt: true,
  customer: { select: safeCustomerSelect },
  createdBy: { select: safeUserSelect },
  items: { select: { quantity: true } },
} satisfies Prisma.ChallanSelect;

const sortFieldMap = {
  createdAt: 'createdAt',
  confirmedAt: 'confirmedAt',
  challanNumber: 'challanNumber',
} as const;

const mergeItems = (items: Array<{ productId: string; quantity: number }>) => {
  const merged = new Map<string, number>();

  for (const item of items) {
    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
  }

  return Array.from(merged.entries()).map(([productId, quantity]) => ({ productId, quantity }));
};

const totalQuantity = (items: Array<{ quantity: number }>) => items.reduce((sum, item) => sum + item.quantity, 0);

const buildChallanItems = (items: Array<{ productId: string; quantity: number }>, productsById: Map<string, Prisma.ProductGetPayload<{ select: typeof safeProductSelect }>>) =>
  items.map((item) => {
    const product = productsById.get(item.productId);

    if (!product) {
      throw new ApiError(404, 'NOT_FOUND', 'Product not found');
    }

    if (!product.isActive) {
      throw new ApiError(409, 'PRODUCT_INACTIVE', 'Product is inactive');
    }

    const lineTotal = new Prisma.Decimal(product.unitPrice).mul(item.quantity);

    return {
      productId: product.id,
      productNameSnapshot: product.name,
      productSkuSnapshot: product.sku,
      unitPriceSnapshot: product.unitPrice,
      quantity: item.quantity,
      lineTotal,
    };
  });

const getChallanDetail = async (tx: Prisma.TransactionClient, challanId: string) => {
  const challan = await tx.challan.findUnique({
    where: { id: challanId },
    select: challanDetailSelect,
  });

  if (!challan) {
    throw new ApiError(404, 'NOT_FOUND', 'Challan not found');
  }

  return {
    ...challan,
    totalQuantity: totalQuantity(challan.items),
  };
};

export const listChallans = async (query: {
  status?: 'DRAFT' | 'CONFIRMED' | 'CANCELLED';
  customerId?: string;
  search?: string;
  from?: Date;
  to?: Date;
  page: number;
  limit: number;
  sortBy: keyof typeof sortFieldMap;
  sortOrder: 'asc' | 'desc';
}) => {
  const where: Prisma.ChallanWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.customerId ? { customerId: query.customerId } : {}),
    ...(query.search ? { challanNumber: { contains: query.search, mode: 'insensitive' } } : {}),
    ...(query.from || query.to ? { createdAt: { ...(query.from ? { gte: query.from } : {}), ...(query.to ? { lte: query.to } : {}) } } : {}),
  };

  const [total, challans] = await Promise.all([
    prisma.challan.count({ where }),
    prisma.challan.findMany({
      where,
      orderBy: { [sortFieldMap[query.sortBy]]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: challanListSelect,
    }),
  ]);

  return {
    data: challans.map((challan) => ({
      ...challan,
      totalQuantity: totalQuantity(challan.items),
    })),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
};

export const getChallanById = async (challanId: string) => {
  const challan = await prisma.challan.findUnique({
    where: { id: challanId },
    select: challanDetailSelect,
  });

  if (!challan) {
    throw new ApiError(404, 'NOT_FOUND', 'Challan not found');
  }

  return {
    ...challan,
    totalQuantity: totalQuantity(challan.items),
  };
};

export const createChallan = async (userId: string, data: { customerId: string; items: Array<{ productId: string; quantity: number }> }) =>
  prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: { id: data.customerId },
      select: { id: true, status: true },
    });

    if (!customer) {
      throw new ApiError(404, 'NOT_FOUND', 'Customer not found');
    }

    if (customer.status !== 'ACTIVE') {
      throw new ApiError(409, 'CUSTOMER_NOT_USABLE', 'Customer cannot be used for a challan');
    }

    const normalizedItems = mergeItems(data.items);
    const products = await tx.product.findMany({
      where: { id: { in: normalizedItems.map((item) => item.productId) } },
      select: safeProductSelect,
    });

    if (products.length !== normalizedItems.length) {
      const productIds = new Set(products.map((product) => product.id));
      const missing = normalizedItems.find((item) => !productIds.has(item.productId));
      throw new ApiError(404, 'NOT_FOUND', 'Product not found', missing ? { productId: missing.productId } : null);
    }

    const productsById = new Map(products.map((product) => [product.id, product]));
    const itemsToCreate = buildChallanItems(normalizedItems, productsById);

    const challan = await tx.challan.create({
      data: {
        customerId: customer.id,
        createdById: userId,
        items: { create: itemsToCreate },
      },
      select: { id: true },
    });

    return getChallanDetail(tx, challan.id);
  });

export const updateChallan = async (userId: string, challanId: string, data: { customerId?: string; items?: Array<{ productId: string; quantity: number }> }) =>
  prisma.$transaction(async (tx) => {
    const challan = await tx.challan.findUnique({
      where: { id: challanId },
      select: { id: true, status: true },
    });

    if (!challan) {
      throw new ApiError(404, 'NOT_FOUND', 'Challan not found');
    }

    if (challan.status !== 'DRAFT') {
      throw new ApiError(409, 'INVALID_STATUS', 'Only draft challans can be edited');
    }

    if (data.customerId) {
      const customer = await tx.customer.findUnique({
        where: { id: data.customerId },
        select: { id: true, status: true },
      });

      if (!customer) {
        throw new ApiError(404, 'NOT_FOUND', 'Customer not found');
      }

      if (customer.status !== 'ACTIVE') {
        throw new ApiError(409, 'CUSTOMER_NOT_USABLE', 'Customer cannot be used for a challan');
      }

      await tx.challan.update({
        where: { id: challanId },
        data: { customerId: customer.id },
      });
    }

    if (data.items) {
      const normalizedItems = mergeItems(data.items);
      const products = await tx.product.findMany({
        where: { id: { in: normalizedItems.map((item) => item.productId) } },
        select: safeProductSelect,
      });

      if (products.length !== normalizedItems.length) {
        const productIds = new Set(products.map((product) => product.id));
        const missing = normalizedItems.find((item) => !productIds.has(item.productId));
        throw new ApiError(404, 'NOT_FOUND', 'Product not found', missing ? { productId: missing.productId } : null);
      }

      const productsById = new Map(products.map((product) => [product.id, product]));
      const itemsToCreate = buildChallanItems(normalizedItems, productsById);

      await tx.challanItem.deleteMany({
        where: { challanId },
      });

      await tx.challanItem.createMany({
        data: itemsToCreate.map((item) => ({
          challanId,
          ...item,
        })),
      });
    }

    return getChallanDetail(tx, challanId);
  });

export const confirmChallan = async (userId: string, challanId: string) =>
  prisma.$transaction(async (tx) => {
    const challan = await tx.challan.findUnique({
      where: { id: challanId },
      select: {
        id: true,
        challanNumber: true,
        status: true,
        createdById: true,
        customerId: true,
        items: { select: { productId: true, quantity: true } },
      },
    });

    if (!challan) {
      throw new ApiError(404, 'NOT_FOUND', 'Challan not found');
    }

    if (challan.status !== 'DRAFT') {
      throw new ApiError(409, 'INVALID_STATUS', 'Only draft challans can be confirmed');
    }

    const products = await tx.product.findMany({
      where: { id: { in: challan.items.map((item) => item.productId) } },
      select: { id: true, currentStock: true, isActive: true },
    });

    if (products.length !== challan.items.length) {
      const productIds = new Set(products.map((product) => product.id));
      const missing = challan.items.find((item) => !productIds.has(item.productId));
      throw new ApiError(404, 'NOT_FOUND', 'Product not found', missing ? { productId: missing.productId } : null);
    }

    const productsById = new Map(products.map((product) => [product.id, product]));

    for (const item of challan.items) {
      const product = productsById.get(item.productId);

      if (!product || !product.isActive) {
        throw new ApiError(409, 'PRODUCT_INACTIVE', 'Product is inactive');
      }

      if (product.currentStock < item.quantity) {
        throw new ApiError(409, 'INSUFFICIENT_STOCK', 'Insufficient stock for this product', {
          productId: item.productId,
          requested: item.quantity,
          available: product.currentStock,
        });
      }
    }

    for (const item of challan.items) {
      const updated = await tx.product.updateMany({
        where: {
          id: item.productId,
          currentStock: { gte: item.quantity },
          isActive: true,
        },
        data: { currentStock: { decrement: item.quantity } },
      });

      if (updated.count !== 1) {
        const currentProduct = await tx.product.findUnique({
          where: { id: item.productId },
          select: { currentStock: true },
        });

        throw new ApiError(409, 'INSUFFICIENT_STOCK', 'Insufficient stock for this product', {
          productId: item.productId,
          requested: item.quantity,
          available: currentProduct?.currentStock ?? 0,
        });
      }

      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          type: 'OUT',
          quantity: item.quantity,
          reason: `Sales challan ${challan.challanNumber}`,
          referenceChallanId: challan.id,
          createdById: userId,
        },
      });
    }

    await tx.challan.update({
      where: { id: challan.id },
      data: { status: 'CONFIRMED', confirmedAt: new Date() },
    });

    return getChallanDetail(tx, challan.id);
  });

export const cancelChallan = async (challanId: string) =>
  prisma.$transaction(async (tx) => {
    const challan = await tx.challan.findUnique({
      where: { id: challanId },
      select: { id: true, status: true },
    });

    if (!challan) {
      throw new ApiError(404, 'NOT_FOUND', 'Challan not found');
    }

    if (challan.status !== 'DRAFT') {
      throw new ApiError(409, 'INVALID_STATUS', 'Only draft challans can be cancelled');
    }

    await tx.challan.update({
      where: { id: challanId },
      data: { status: 'CANCELLED' },
    });

    return getChallanDetail(tx, challanId);
  });
