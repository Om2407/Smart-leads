import { Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { LeadStats } from '../../types';
import { Spinner } from '../ui/Spinner';

interface StatsCardsProps {
  stats?: LeadStats;
  isLoading?: boolean;
}

export const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  const getCount = (id: string) => stats?.statusStats.find(s => s._id === id)?.count ?? 0;

  const cards = [
    { label: 'Total Leads', value: stats?.total ?? 0, icon: Users, color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Qualified', value: getCount('Qualified'), icon: CheckCircle, color: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Contacted', value: getCount('Contacted'), icon: TrendingUp, color: 'bg-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: 'Lost', value: getCount('Lost'), icon: XCircle, color: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  ];

  if (isLoading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-3" />
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-12" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="card p-4 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-2xl font-bold tabular-nums">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
