import { Response } from 'express';
import httpStatus from 'http-status';

export const sendSuccess = (res: Response, data: unknown, statusCode = httpStatus.OK) => {
  return res.status(statusCode).json({ success: true, data });
};

export const sendError = (res: Response, message: string, statusCode = httpStatus.INTERNAL_SERVER_ERROR) => {
  return res.status(statusCode).json({ success: false, error: message });
};
