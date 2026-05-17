import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Parser } from 'json2csv';
import Lead from '../models/Lead';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { LeadFilters, LeadStatus, LeadSource } from '../types';

export const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status'),
  body('source')
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Source must be Website, Instagram, or Referral'),
  body('notes').optional().trim(),
];

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  const {
    status,
    source,
    search,
    sort = 'latest',
    page = '1',
    limit = '10',
  } = req.query as Record<string, string>;

  const filters: Record<string, unknown> = {};

  if (status) filters.status = status as LeadStatus;
  if (source) filters.source = source as LeadSource;
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Sales users can only see their own leads
  if (req.user?.role === 'sales') {
    filters.createdBy = req.user.id;
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;
  const sortOrder = sort === 'oldest' ? 1 : -1;

  const [leads, total] = await Promise.all([
    Lead.find(filters)
      .populate('createdBy', 'name email')
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limitNum),
    Lead.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  sendSuccess(res, 'Leads fetched', leads, 200, {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    hasNext: pageNum < totalPages,
    hasPrev: pageNum > 1,
  });
};

export const getLead = async (req: Request, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
  if (!lead) {
    sendError(res, 'Lead not found', 404);
    return;
  }

  // Sales users can only view their own leads
  if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
    sendError(res, 'Access denied', 403);
    return;
  }

  sendSuccess(res, 'Lead fetched', lead);
};

export const createLead = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 400, errors.array().map(e => e.msg).join(', '));
    return;
  }

  const lead = await Lead.create({ ...req.body, createdBy: req.user?.id });
  sendSuccess(res, 'Lead created', lead, 201);
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 400, errors.array().map(e => e.msg).join(', '));
    return;
  }

  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    sendError(res, 'Lead not found', 404);
    return;
  }

  // Sales users can only update their own leads
  if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
    sendError(res, 'Access denied', 403);
    return;
  }

  const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, 'Lead updated', updated);
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    sendError(res, 'Lead not found', 404);
    return;
  }

  // Only admins can delete leads
  if (req.user?.role !== 'admin') {
    sendError(res, 'Only admins can delete leads', 403);
    return;
  }

  await Lead.findByIdAndDelete(req.params.id);
  sendSuccess(res, 'Lead deleted');
};

export const exportLeadsCSV = async (req: Request, res: Response): Promise<void> => {
  const filters: Record<string, unknown> = {};
  if (req.user?.role === 'sales') filters.createdBy = req.user.id;

  const leads = await Lead.find(filters).populate('createdBy', 'name email').lean();

  const fields = ['name', 'email', 'status', 'source', 'notes', 'createdAt'];
  const parser = new Parser({ fields });
  const csv = parser.parse(leads);

  res.header('Content-Type', 'text/csv');
  res.attachment('leads-export.csv');
  res.send(csv);
};

export const getLeadStats = async (req: Request, res: Response): Promise<void> => {
  const matchStage = req.user?.role === 'sales' 
    ? { $match: { createdBy: req.user.id } }
    : { $match: {} };

  const [statusStats, sourceStats, total] = await Promise.all([
    Lead.aggregate([matchStage, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Lead.aggregate([matchStage, { $group: { _id: '$source', count: { $sum: 1 } } }]),
    Lead.countDocuments(req.user?.role === 'sales' ? { createdBy: req.user.id } : {}),
  ]);

  sendSuccess(res, 'Stats fetched', { total, statusStats, sourceStats });
};
