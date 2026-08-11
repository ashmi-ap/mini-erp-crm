import type { NextFunction, Request, RequestHandler, Response } from 'express';

export const asyncHandler =
  <TReq extends Request = Request>(handler: (req: TReq, res: Response, next: NextFunction) => Promise<void>): RequestHandler =>
  (req, res, next) => {
    void handler(req as TReq, res, next).catch(next);
  };
