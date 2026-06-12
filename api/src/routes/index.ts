import { Router } from 'express';

import testRoute from './testRoute';
import extensionsRoute from './extensions';
import configManagementRoute from './configManagement';

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
configManagementRoute(router);

export default router;
