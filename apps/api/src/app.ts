import cors from 'cors';
import express from 'express';

import { apiRouter } from './routes';
import { errorHandler } from './middlewares/errorHandler';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);
app.use(errorHandler);
