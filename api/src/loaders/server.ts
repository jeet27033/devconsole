import * as express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import routes from '../routes';
import logger from '../helpers/logger';

export default async (app: express.Application) => {
  app.enable('trust proxy');

  app.use(cookieParser());
  app.use(cors());
  app.use(helmet());
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/devconsole/api', routes);

  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
  });

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('Unhandled error:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  });
};
