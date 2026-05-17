import { useState } from 'react';
import { Lead, LeadStatus, LeadSource } from '../../types';
import { Spinner } from '../ui/Spinner';

interface LeadFormProps {
  initialData?: Partial<Lead>;
  onSubmit: (data: Partial<Lead>) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const sources: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export const LeadForm = ({ initialData, onSubmit, isLoading, onCancel }: LeadFormProps) => {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    status: initialData?.status || 'New' as LeadStatus,
    source: initialData?.source || 'Website' as LeadSource,
    notes: initialData?.notes || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Name *</label>
        <input className={`input ${errors.name ? 'border-red-400' : ''}`} value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe" />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="label">Email *</label>
        <input className={`input ${errors.email ? 'border-red-400' : ''}`} value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" type="email" />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Source</label>
          <select className="input" value={form.source} onChange={e => set('source', e.target.value)}>
            {sources.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Notes</label>
        <textarea className="input resize-none" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional notes..." />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? <Spinner size="sm" /> : null}
          {initialData?._id ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};
