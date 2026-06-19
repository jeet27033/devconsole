import { Router, Request, Response } from 'express';
import logger from '../helpers/logger';
import { SuccessResponse, ErrorResponse } from '../helpers/responseHandler';
import {
  getPlatforms,
  getFormMetadata,
  getSettings,
  updateSettings,
  listAlertConditions,
  getAlertConditionDetails,
  createAlertCondition,
  updateAlertCondition,
  performConditionAction,
  listAlertIssues,
  performIssueAction,
  getMetricProducts,
  getMetricDashboards,
  getDashboardPages,
  executeNrql,
} from '../services/newrelic-alerts';

export default (router: Router) => {
  const route = Router();
  router.use('/newrelic', route);

  // ── Platforms ──────────────────────────────────────────────────────────────

  route.get('/platforms', async (_req: Request, res: Response) => {
    try {
      return SuccessResponse(res, getPlatforms(), 200);
    } catch (e) {
      logger.error('GET /newrelic/platforms error', e);
      return ErrorResponse(res, e);
    }
  });

  route.get('/form-meta', async (_req: Request, res: Response) => {
    try {
      return SuccessResponse(res, getFormMetadata(), 200);
    } catch (e) {
      logger.error('GET /newrelic/form-meta error', e);
      return ErrorResponse(res, e);
    }
  });

  // ── Settings ───────────────────────────────────────────────────────────────

  route.get('/settings', async (req: Request, res: Response) => {
    try {
      const orgId = Number(req.headers['x-cap-api-auth-org-id']) || 0;
      const data = await getSettings(orgId);
      return SuccessResponse(res, data, 200);
    } catch (e) {
      logger.error('GET /newrelic/settings error', e);
      return ErrorResponse(res, e);
    }
  });

  route.put('/settings', async (req: Request, res: Response) => {
    try {
      const orgId = Number(req.headers['x-cap-api-auth-org-id']) || 0;
      const { slack_webhook_url } = req.body;
      if (!slack_webhook_url) return ErrorResponse(res, new Error('slack_webhook_url is required'));
      const data = await updateSettings(orgId, slack_webhook_url);
      return SuccessResponse(res, data, 200);
    } catch (e) {
      logger.error('PUT /newrelic/settings error', e);
      return ErrorResponse(res, e);
    }
  });

  // ── Alert Conditions ───────────────────────────────────────────────────────

  route.get('/conditions', async (req: Request, res: Response) => {
    try {
      const orgId = Number(req.headers['x-cap-api-auth-org-id']) || 0;
      const { status, platform, search } = req.query as Record<string, string>;
      const data = await listAlertConditions(orgId, { status, platform, search });
      return SuccessResponse(res, data, 200);
    } catch (e) {
      logger.error('GET /newrelic/conditions error', e);
      return ErrorResponse(res, e);
    }
  });

  route.get('/conditions/:id', async (req: Request, res: Response) => {
    try {
      const orgId = Number(req.headers['x-cap-api-auth-org-id']) || 0;
      const id = Number(req.params.id);
      const data = await getAlertConditionDetails(orgId, id);
      if (!data) return ErrorResponse(res, new Error('Condition not found'));
      return SuccessResponse(res, data, 200);
    } catch (e) {
      logger.error('GET /newrelic/conditions/:id error', e);
      return ErrorResponse(res, e);
    }
  });

  route.post('/conditions', async (req: Request, res: Response) => {
    try {
      const orgId = Number(req.headers['x-cap-api-auth-org-id']) || 0;
      const user = (req.headers['x-cap-remote-user'] as string) || 'unknown';
      const data = await createAlertCondition(orgId, user, req.body);
      return SuccessResponse(res, data, 201);
    } catch (e) {
      logger.error('POST /newrelic/conditions error', e);
      return ErrorResponse(res, e);
    }
  });

  route.put('/conditions/:id', async (req: Request, res: Response) => {
    try {
      const orgId = Number(req.headers['x-cap-api-auth-org-id']) || 0;
      const user = (req.headers['x-cap-remote-user'] as string) || 'unknown';
      const id = Number(req.params.id);
      const data = await updateAlertCondition(orgId, id, user, req.body);
      return SuccessResponse(res, data, 200);
    } catch (e) {
      logger.error('PUT /newrelic/conditions/:id error', e);
      return ErrorResponse(res, e);
    }
  });

  route.post('/conditions/:id/action', async (req: Request, res: Response) => {
    try {
      const orgId = Number(req.headers['x-cap-api-auth-org-id']) || 0;
      const id = Number(req.params.id);
      const { action } = req.body;
      if (!['enable', 'disable', 'delete'].includes(action)) {
        return ErrorResponse(res, new Error('action must be enable, disable, or delete'));
      }
      const data = await performConditionAction(orgId, id, action as 'enable' | 'disable' | 'delete');
      return SuccessResponse(res, data, 200);
    } catch (e) {
      logger.error('POST /newrelic/conditions/:id/action error', e);
      return ErrorResponse(res, e);
    }
  });

  // ── Issues ─────────────────────────────────────────────────────────────────

  route.get('/issues', async (req: Request, res: Response) => {
    try {
      const orgId = Number(req.headers['x-cap-api-auth-org-id']) || 0;
      const { status, priority, platform, startTime, endTime } = req.query as { status?: string; priority?: string; platform?: string; startTime?: string; endTime?: string };
      const data = await listAlertIssues(orgId, {
        status,
        priority,
        platform,
        startTime: startTime ? Number(startTime) : undefined,
        endTime: endTime ? Number(endTime) : undefined,
      });
      return SuccessResponse(res, data, 200);
    } catch (e) {
      logger.error('GET /newrelic/issues error', e);
      return ErrorResponse(res, e);
    }
  });

  route.post('/issues/:id/action', async (req: Request, res: Response) => {
    try {
      const violationId: string = String(req.params.id);
      const action: string = String(req.body.action || '');
      if (!['acknowledge', 'close'].includes(action)) {
        return ErrorResponse(res, new Error('action must be acknowledge or close'));
      }
      const data = await performIssueAction(violationId, action as 'acknowledge' | 'close');
      return SuccessResponse(res, data, 200);
    } catch (e) {
      logger.error('POST /newrelic/issues/:id/action error', e);
      return ErrorResponse(res, e);
    }
  });

  // ── Platform Metrics ────────────────────────────────────────────────────────

  route.get('/metric-products', async (_req: Request, res: Response) => {
    try {
      return SuccessResponse(res, getMetricProducts(), 200);
    } catch (e) {
      return ErrorResponse(res, e);
    }
  });

  route.get('/metric-dashboards', async (req: Request, res: Response) => {
    try {
      const { product } = req.query as { product?: string };
      const data = await getMetricDashboards(product ?? '');
      return SuccessResponse(res, data, 200);
    } catch (e) {
      logger.error('GET /newrelic/metric-dashboards error', e);
      return ErrorResponse(res, e);
    }
  });

  route.get('/dashboard-pages', async (req: Request, res: Response) => {
    try {
      const { guid } = req.query as { guid?: string };
      if (!guid) return ErrorResponse(res, new Error('guid is required'));
      const data = await getDashboardPages(guid);
      return SuccessResponse(res, data, 200);
    } catch (e) {
      logger.error('GET /newrelic/dashboard-pages error', e);
      return ErrorResponse(res, e);
    }
  });

  route.post('/nrql', async (req: Request, res: Response) => {
    try {
      const { accountId, nrql, since, until } = req.body;
      if (!nrql) return ErrorResponse(res, new Error('nrql is required'));
      const accId = accountId ?? Number(process.env.NEWRELIC_ACCOUNT_ID ?? 0);
      const data = await executeNrql(Number(accId), nrql, { since, until });
      return SuccessResponse(res, data, 200);
    } catch (e) {
      logger.error('POST /newrelic/nrql error', e);
      return ErrorResponse(res, e);
    }
  });
};
