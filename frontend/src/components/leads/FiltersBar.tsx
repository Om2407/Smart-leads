import { Search, SlidersHorizontal, X } from 'lucide-react';
import { LeadFilters, LeadStatus, LeadSource, SortOrder } from '../../types';

interface FiltersBarProps {
  filters: LeadFilters;
  searchInput: string;
  onSearchChange: (v: string) => void;
  onFilterChange: (k: keyof LeadFilters, v: string) => void;
  onReset: () => void;
}

const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const sources: LeadSource[] = ['Website', 'Instagram', 'Referral'];
const sorts: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
];

export const FiltersBar = ({ filters, searchInput, onSearchChange, onFilterChange, onReset }: FiltersBarProps) => {
  const hasActive = filters.status || filters.source || filters.search || filters.sort !== 'latest';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className="input pl-9 h-9"
          placeholder="Search name or email..."
          value={searchInput}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-slate-400" />
        <select className="input h-9 w-auto text-sm pr-8" value={filters.status || ''} onChange={e => onFilterChange('status', e.target.value)}>
          <option value="">All Status</option>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="input h-9 w-auto text-sm pr-8" value={filters.source || ''} onChange={e => onFilterChange('source', e.target.value)}>
          <option value="">All Sources</option>
          {sources.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="input h-9 w-auto text-sm pr-8" value={filters.sort || 'latest'} onChange={e => onFilterChange('sort', e.target.value)}>
          {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {hasActive && (
          <button onClick={onReset} className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors">
            <X className="w-3 h-3" /> Reset
          </button>
        )}
      </div>
    </div>
  );
};
