import { Users } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({
  title = 'No leads found',
  description = 'Add your first lead or try adjusting the filters.',
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
      <Users className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-4">{description}</p>
    {action}
  </div>
);
