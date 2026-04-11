import { Router } from 'express';

import testRoute from './testRoute';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

const router = Router();

testRoute(router);

export default router;
