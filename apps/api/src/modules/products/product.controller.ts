import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/asyncHandler';
import { sendData } from '../../utils/response';
import { createProduct, getProductById, listProducts, updateProduct } from './product.service';

export const listProductsHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = res.locals.validated?.query as Parameters<typeof listProducts>[0];
  const result = await listProducts(query);
  res.json(result);
});

export const getProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const params = res.locals.validated?.params as { id: string };
  const product = await getProductById(params.id);
  sendData(res, product);
});

export const createProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const body = res.locals.validated?.body as {
    name: string;
    sku: string;
    category: string;
    unitPrice: number;
    currentStock: number;
    minStockAlert: number;
    warehouse: string;
    isActive?: boolean;
  };

  const product = await createProduct({
    name: body.name,
    sku: body.sku,
    category: body.category,
    unitPrice: body.unitPrice,
    currentStock: body.currentStock,
    minStockAlert: body.minStockAlert,
    warehouse: body.warehouse,
    isActive: body.isActive,
  });

  sendData(res, product, 201);
});

export const updateProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const params = res.locals.validated?.params as { id: string };
  const body = res.locals.validated?.body as {
    name?: string;
    category?: string;
    unitPrice?: number;
    minStockAlert?: number;
    warehouse?: string;
    isActive?: boolean;
  };

  const product = await updateProduct(params.id, {
    name: body.name,
    category: body.category,
    unitPrice: body.unitPrice,
    minStockAlert: body.minStockAlert,
    warehouse: body.warehouse,
    isActive: body.isActive,
  });

  sendData(res, product);
});
