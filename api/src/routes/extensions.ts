import { Router, Request, Response, NextFunction } from 'express';
import Arya from '@capillarytech/arya';
import {
  authenticateMiddleware,
  validate,
  authenticateMiddlewareWithProxy,
} from '../middlewares';
import { SuccessResponse, ErrorResponse } from '../helpers/responseHandler';
import {
  getExtensionsBuildHistory,
  getExtensionsBuildLogs,
  getExtensionsBuildMetaData,
  extensionsTriggerBuild,
  getExtensionLists,
  fetchLokiLogs,
} from '../services/extensions';
import {
  buildLogsBodySchema,
  triggerBuildBodySchema,
  lokiLogsBodySchema,
} from '../joiSchema/extensions';
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
    //authenticateMiddleware(),
    async (req: Request, res: Response) => {
      try {
        const orgId = req.headers['x-cap-api-auth-org-id'] as any;
        const response = await getExtensionsBuildHistory(orgId);
        return SuccessResponse(res, response, 200);
      } catch (e) {
        logger.error('Error fetching homepage metrics', e);
        return ErrorResponse(res, e);
      }
    },
  );

  route.post(
    '/build-logs',
    //authenticateMiddleware(),
    validate(buildLogsBodySchema),
    async (req: Request, res: Response) => {
      try {
        const { buildId, extensionName } = req.body;
        const response = await getExtensionsBuildLogs(buildId, extensionName);
        return SuccessResponse(res, response, 200);
      } catch (e) {
        logger.error('Error fetching homepage metrics', e);
        return ErrorResponse(res, e);
      }
    },
  );

  route.get(
    '/build-meta',
    //authenticateMiddleware(),
    async (req: Request, res: Response) => {
      try {
        const orgId = req.headers['x-cap-api-auth-org-id'] as any;
        const userId = req.headers['x-cap-remote-user'] as any;
        const response = await getExtensionsBuildMetaData(orgId, userId);
        return SuccessResponse(res, response, 200);
      } catch (e) {
        logger.error('Error fetching homepage metrics', e);
        return ErrorResponse(res, e);
      }
    },
  );

  route.get(
    '/build-trigger',
    //authenticateMiddleware(),
    validate(triggerBuildBodySchema),
    async (req: Request, res: Response) => {
      try {
        const orgId = req.headers['x-cap-api-auth-org-id'] as any;
        const userId = req.headers['x-cap-remote-user'] as any;
        const body = req.body;
        const response = await extensionsTriggerBuild(orgId, userId, body);
        return SuccessResponse(res, response, 200);
      } catch (e) {
        logger.error('Error fetching homepage metrics', e);
        return ErrorResponse(res, e);
      }
    },
  );


  route.get(
    '/get-extensions',
    //authenticateMiddleware(),
    async (req: Request, res: Response) => {
      try {
        const orgId = req.headers['x-cap-api-auth-org-id'] as any;
        const response = await getExtensionLists(orgId);
        return SuccessResponse(res, response, 200);
      } catch (e) {
        logger.error('Error fetching homepage metrics', e);
        return ErrorResponse(res, e);
      }
    },
  );

  route.post(
    '/log-viewer',
    //authenticateMiddleware(),
    validate(lokiLogsBodySchema),
    async (req: Request, res: Response) => {
      try {
        const orgId = req.headers['x-cap-api-auth-org-id'] as any;
        const {
          appName,
          extension = '',
          search = '',
          startTime,
          endTime,
          isFullLogsChecked = false,
          type = 'app',
          newRelicAppName = null,
          userTimezone,
        } = req.body;
        const response = await fetchLokiLogs(
          Number(orgId),
          appName,
          extension,
          search,
          Number(startTime),
          Number(endTime),
          Boolean(isFullLogsChecked),
          type,
          newRelicAppName,
          userTimezone,
        );
        return SuccessResponse(res, response, 200);
      } catch (e) {
        logger.error('Error fetching loki logs', e);
        return ErrorResponse(res, e);
      }
    },
  );
};
