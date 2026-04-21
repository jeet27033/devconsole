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
