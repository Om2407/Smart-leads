import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthPayload, UserRole } from '../types';

const generateToken = (id: string, role: UserRole): string => {
  const payload: AuthPayload = { id, role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'sales']).withMessage('Role must be admin or sales'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 400, errors.array().map(e => e.msg).join(', '));
    return;
  }

  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    sendError(res, 'Email already registered', 409);
    return;
  }

  const user = await User.create({ name, email, password, role: role || 'sales' });
  const token = generateToken(user._id.toString(), user.role);

  sendSuccess(res, 'Registration successful', { user, token }, 201);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 400, errors.array().map(e => e.msg).join(', '));
    return;
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    sendError(res, 'Invalid email or password', 401);
    return;
  }

  const token = generateToken(user._id.toString(), user.role);
  const userObj = user.toJSON();

  sendSuccess(res, 'Login successful', { user: userObj, token });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    sendError(res, 'User not found', 404);
    return;
  }
  sendSuccess(res, 'User fetched', user);
};
