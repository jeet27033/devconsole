import { Router, Request, Response , NextFunction } from 'express';
import Arya from '@capillarytech/arya';
import { authenticateMiddleware } from '../middlewares/auth';
import { SuccessResponse, ErrorResponse , ApiError } from '../helpers/responseHandler';
import {getExtensionsBuildHistory} from '../services/extensions';
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
    app.use('/extensions', route);

    route.get(
    '/build-history',
    authenticateMiddleware(),
    async (req: Request, res: Response) => {
        try {
            const { orgId } = req as any;
            const response = await getExtensionsBuildHistory(orgId);
            return SuccessResponse(res, response, 200);
        } catch (e) {
            logger.error('Error fetching homepage metrics', e);
            return ErrorResponse(res, e);
        }
    },
    );
};
