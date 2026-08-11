import type { Response } from 'express';

export const sendData = <T>(res: Response, data: T, status = 200) => res.status(status).json({ data });
