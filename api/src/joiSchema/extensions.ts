import Joi from 'joi';

export const buildLogsBodySchema = Joi.object({
  buildId: Joi.number().integer().positive().required(),
  extensionName: Joi.string().trim().min(1).required(),
});

export const triggerBuildBodySchema = Joi.object({
  description: Joi.string().trim().allow('').max(1000).required(),
  extensionName: Joi.string().trim().min(1).required(),
  githubUrl: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required(),
  branchOrTag: Joi.string().trim().min(1).required(),
  username: Joi.string().trim().min(1).optional(),
});

export const lokiLogsBodySchema = Joi.object({
  appName: Joi.string().trim().min(1).required(),
  extension: Joi.string().trim().allow('').optional(),
  search: Joi.string().allow('').optional(),
  startTime: Joi.number().integer().required(),
  endTime: Joi.number().integer().required(),
  isFullLogsChecked: Joi.boolean().optional(),
  type: Joi.string().valid('app', 'extension').optional(),
  newRelicAppName: Joi.string().allow(null, '').optional(),
  userTimezone: Joi.string().trim().min(1).optional(),
});


