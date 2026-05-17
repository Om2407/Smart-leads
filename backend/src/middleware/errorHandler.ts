import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err.message);
  sendError(res, 'Internal server error', 500, err.message);
};

export const notFound = (_req: Request, res: Response): void => {
  sendError(res, 'Route not found', 404);
};
