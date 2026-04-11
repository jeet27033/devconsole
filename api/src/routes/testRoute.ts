import { Request, Response, Router } from 'express';

import { sendSuccess } from '../helpers/responseHandler';

const route = Router();

route.get('/ping', (_req: Request, res: Response) => {
  sendSuccess(res, { message: 'pong', timestamp: new Date().toISOString() });
});

export default (app: Router) => {
  app.use('/test', route);
};
