import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
  meta?: PaginationMeta
): Response => {
  const response: ApiResponse<T> = { success: true, message, data, meta };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  error?: string
): Response => {
  const response: ApiResponse<null> = { success: false, message, error };
  return res.status(statusCode).json(response);
};
