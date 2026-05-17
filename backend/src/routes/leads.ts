import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
  leadValidation,
} from '../controllers/leadsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/stats', getLeadStats);
router.get('/export', exportLeadsCSV);
router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', leadValidation, createLead);
router.put('/:id', leadValidation, updateLead);
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
