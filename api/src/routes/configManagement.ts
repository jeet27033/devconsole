import { Router, Request, Response, NextFunction } from 'express';
import Arya from '@capillarytech/arya';
import {
  authenticateMiddleware,
  validate,
  authenticateMiddlewareWithProxy,
} from '../middlewares';
import { SuccessResponse, ErrorResponse } from '../helpers/responseHandler';
import { getConfigData, saveConfigRequest } from '../services/configManagement';
import { v4 as uuidv4 } from 'uuid';
import { errorMsg } from '../constants/error-msg';

const logger = Arya.Logger.getLogger('devconsole-api');
const route = Router();

route.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.headers['x-cap-request-id'] && !req.headers['x-cap-requestid']) {
    req.requestId = uuidv4();
    req.headers['x-cap-request-id'] = req.requestId;
  }
  next();
});

export default (app: Router) => {
  app.use('/config', route);

  route.post(
    '/get',
    //authenticateMiddleware(),
    async (req: Request, res: Response) => {
      try {
        const orgId = req.headers['x-cap-api-auth-org-id'] as any;
        const { status } = req.body;
        const response = await getConfigData(orgId, status);
        return SuccessResponse(res, response, 200);
      } catch (e) {
        logger.error('Error fetching homepage metrics', e);
        return ErrorResponse(res, e);
      }
    },
  );

  route.post(
    '/save',
    //authenticateMiddleware(),
    async (req: Request, res: Response) => {
      try {
        const { payload, userMail, status, action, configId } = req.body;
        const response = await saveConfigRequest(
          payload,
          userMail,
          status,
          action,
          configId,
        );
        return SuccessResponse(res, response, 200);
      } catch (e) {
        logger.error('Error fetching homepage metrics', e);
        return ErrorResponse(res, e);
      }
    },
  );
};
