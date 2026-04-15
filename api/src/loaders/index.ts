import * as express from 'express';

import server from './server';
import { connectMySQL } from './mysql';
import { connectMongo } from './mongo';
import logger from '../helpers/logger';

export default async (app: express.Application) => {
  await server(app);
  await connectMySQL();
  await connectMongo();
  logger.info('Server loaded!');
};
