import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthPayload, UserRole } from '../types';
import { sendError } from '../utils/apiResponse';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Access denied. No token provided.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    sendError(res, 'Invalid or expired token.', 401);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, 'Access denied. Insufficient permissions.', 403);
      return;
    }
    next();
  };
};
