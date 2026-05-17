import { Edit2, Trash2, Eye, Globe, Instagram, Users } from 'lucide-react';
import { Lead } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { useAuthStore } from '../../store/authStore';

const sourceIcon: Record<string, React.ReactNode> = {
  Website: <Globe className="w-3 h-3" />,
  Instagram: <Instagram className="w-3 h-3" />,
  Referral: <Users className="w-3 h-3" />,
};

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

export const LeadsTable = ({ leads, onEdit, onDelete, onView }: LeadsTableProps) => {
  const { user } = useAuthStore();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
          {leads.map(lead => (
            <tr key={lead._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-800 dark:text-slate-200">{lead.name}</div>
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">{lead.email}</td>
              <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                  {sourceIcon[lead.source]} {lead.source}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">
                {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onView(lead)} className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 text-primary-500 transition-colors" title="View">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onEdit(lead)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors" title="Edit">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {user?.role === 'admin' && (
                    <button onClick={() => onDelete(lead)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400 transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
