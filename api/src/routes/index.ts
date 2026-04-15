import { Router } from 'express';

import testRoute from './testRoute';
import extensionsRoute from './extensions';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

const router = Router();

testRoute(router);
extensionsRoute(router);

export default router;
