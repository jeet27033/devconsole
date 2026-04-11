import * as express from 'express';

import server from './server';
import logger from '../helpers/logger';

export default async (app: express.Application) => {
  await server(app);
  logger.info('Server loaded!');
};
