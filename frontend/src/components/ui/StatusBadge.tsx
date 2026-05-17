import { LeadStatus } from '../../types';

const map: Record<LeadStatus, string> = {
  New: 'badge-new',
  Contacted: 'badge-contacted',
  Qualified: 'badge-qualified',
  Lost: 'badge-lost',
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => (
  <span className={map[status]}>{status}</span>
);
