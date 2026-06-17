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
  getAppConfig,
  fetchOrgDBs,
  dbCollections,
  executeMongoQuery,
  isWriteQuery,
  getCollectionSchema,
  saveMongoAuditLog,
  getMongoAuditLogs,
  getMongoAuditLogById,
  approveMongoAuditLog,
  rejectMongoAuditLog,
} from '../services/extensions';
import {
  buildLogsBodySchema,
  triggerBuildBodySchema,
  lokiLogsBodySchema,
} from '../joiSchema/extensions';
import { v4 as uuidv4 } from 'uuid';
import { errorMsg } from '../constants/error-msg';
import config from '../config';

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

  route.get(
    '/get-fields',
    //authenticateMiddleware(),
    async (req: Request, res: Response) => {
      try {
        const orgId = req.headers['x-cap-api-auth-org-id'] as any;
        const { appName } = req.query as any; 
        const response = await getAppConfig(appName, orgId, config.CLUSTER);
        return SuccessResponse(res, response, 200);
      }catch (e) {
        logger.error('Error fetching homepage metrics', e);
        return ErrorResponse(res, e);
      }
    }
  )

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

  route.get(
    '/get-dbs',
    async (req: Request, res: Response) => {
      try {
        const orgId = req.headers['x-cap-api-auth-org-id'] as string;
        const response = fetchOrgDBs(Number(orgId));
        return SuccessResponse(res, response, 200);
      } catch (e) {
        logger.error('Error fetching org DBs', e);
        return ErrorResponse(res, e);
      }
    },
  );

  route.get(
    '/get-collections',
    async (req: Request, res: Response) => {
      try {
        const { db } = req.query as { db: string };
        if (!db) return ErrorResponse(res, new Error('db query param is required'));
        const response = await dbCollections(db);
        return SuccessResponse(res, response, 200);
      } catch (e) {
        logger.error('Error fetching collections', e);
        return ErrorResponse(res, e);
      }
    },
  );

  route.get(
    '/mongo-schema',
    async (req: Request, res: Response) => {
      try {
        const { db, collection } = req.query as { db: string; collection: string };
        if (!db || !collection) return ErrorResponse(res, new Error('db and collection are required'));
        const schema = await getCollectionSchema(db, collection);
        return SuccessResponse(res, schema, 200);
      } catch (e) {
        logger.error('Error fetching mongo schema', e);
        return ErrorResponse(res, e);
      }
    },
  );

  route.post(
    '/mongo-query',
    async (req: Request, res: Response) => {
      const orgId = Number(req.headers['x-cap-api-auth-org-id']);
      const createdBy = (req.headers['x-cap-remote-user'] as string) || 'unknown';
      const { db, query } = req.body;

      if (!db || !query) return ErrorResponse(res, new Error('db and query are required'));
      if (isWriteQuery(query)) {
        return ErrorResponse(res, new Error('Write queries are not allowed. Use the approval flow for write operations.'));
      }

      let status: 'SUCCESS' | 'FAILED' = 'FAILED';
      let executionTime: number | null = null;
      let noOfRecords: number | null = null;

      try {
        const response = await executeMongoQuery(db, query);
        executionTime = response.executionTime;
        status = 'SUCCESS';
        try {
          const parsed = JSON.parse(response.output);
          noOfRecords = Array.isArray(parsed) ? parsed.length : 1;
        } catch { noOfRecords = null; }

        saveMongoAuditLog({ query, created_by: createdBy, query_execution_time: executionTime, status, no_of_records: noOfRecords, mongo_database: db, collection: '', org_id: orgId })
          .catch((e) => logger.error('Failed to save mongo audit log', e));

        return SuccessResponse(res, response, 200);
      } catch (e) {
        saveMongoAuditLog({ query, created_by: createdBy, query_execution_time: null, status: 'FAILED', no_of_records: 0, mongo_database: db, collection: '', org_id: orgId })
          .catch((err) => logger.error('Failed to save mongo audit log', err));
        logger.error('Error executing mongo query', e);
        return ErrorResponse(res, e);
      }
    },
  );

  route.get(
    '/mongo-audit-logs',
    async (req: Request, res: Response) => {
      try {
        const orgId = Number(req.headers['x-cap-api-auth-org-id']);
        const { status, search, lastId } = req.query as Record<string, string>;
        const logs = await getMongoAuditLogs(orgId, {
          status: status || undefined,
          search: search || undefined,
          lastId: lastId ? Number(lastId) : undefined,
        });
        return SuccessResponse(res, logs, 200);
      } catch (e) {
        logger.error('Error fetching mongo audit logs', e);
        return ErrorResponse(res, e);
      }
    },
  );

  route.get(
    '/mongo-audit-logs/:id',
    async (req: Request, res: Response) => {
      try {
        const orgId = Number(req.headers['x-cap-api-auth-org-id']);
        const id = Number(req.params.id);
        if (!id) return ErrorResponse(res, new Error('id is required'));
        const log = await getMongoAuditLogById(id, orgId);
        if (!log) return ErrorResponse(res, new Error('Not found'));
        return SuccessResponse(res, log, 200);
      } catch (e) {
        logger.error('Error fetching mongo audit log detail', e);
        return ErrorResponse(res, e);
      }
    },
  );

  route.post(
    '/mongo-audit-logs/:id/approve',
    async (req: Request, res: Response) => {
      try {
        const orgId = Number(req.headers['x-cap-api-auth-org-id']);
        const approverUser = req.headers['x-cap-remote-user'] as string;
        const id = Number(req.params.id);
        if (!id) return ErrorResponse(res, new Error('id is required'));
        const result = await approveMongoAuditLog(id, orgId, approverUser);
        return SuccessResponse(res, result, 200);
      } catch (e) {
        logger.error('Error approving mongo audit log', e);
        return ErrorResponse(res, e);
      }
    },
  );

  route.post(
    '/mongo-audit-logs/:id/reject',
    async (req: Request, res: Response) => {
      try {
        const orgId = Number(req.headers['x-cap-api-auth-org-id']);
        const rejectorUser = req.headers['x-cap-remote-user'] as string;
        const id = Number(req.params.id);
        if (!id) return ErrorResponse(res, new Error('id is required'));
        const result = await rejectMongoAuditLog(id, orgId, rejectorUser);
        return SuccessResponse(res, result, 200);
      } catch (e) {
        logger.error('Error rejecting mongo audit log', e);
        return ErrorResponse(res, e);
      }
    },
  );
};
