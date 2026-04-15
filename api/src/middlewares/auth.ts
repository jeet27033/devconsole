import Arya from '@capillarytech/arya';
import { Request, Response, NextFunction } from 'express';

const logger = Arya.Logger.getLogger('devconsole-api');
const auth = Arya.AuthServiceSdk();

declare global {
  namespace Express {
    interface Request {
      orgId?: string;
    }
  }
}

const VALID_PROXIES = new Set(['apigateway', 'connectplus', 'cortex']);

export const authenticateMiddleware = () => {
  logger.info('initialize authenticateMiddleware');

  const middlewares = auth.authenticate();

  return middlewares.map((middleware: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
      logger.info('arya auth req id:', req.headers['x-cap-request-id']);
      return middleware(req, res, next);
    };
  });
};

export const authenticateMiddlewareWithProxy = () => {
  logger.info('initialize authenticateMiddlewareWithProxy');

  const middlewares = auth.authenticate();

  return middlewares.map((middleware: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const requestId = req.headers['x-cap-request-id'];
      const proxy = req.headers['x-cap-neo-proxy-one'] as string;
      const orgId = req.headers['x-cap-api-auth-org-id'];

      logger.info('incoming request:', requestId);

      if (!VALID_PROXIES.has(proxy) || !orgId) {
        logger.info('applying arya auth:', requestId);
        return middleware(req, res, next);
      }

      logger.info('skipping arya auth:', requestId);
      req.orgId = orgId as string;

      return next();
    };
  });
};
