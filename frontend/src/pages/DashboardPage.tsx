import { useState } from 'react';
import { Plus, Download, RefreshCw } from 'lucide-react';
import { LeadFilters, Lead } from '../types';
import { useLeads, useLeadStats, useCreateLead, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { leadsApi } from '../api/leads';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/layout/Navbar';
import { StatsCards } from '../components/leads/StatsCards';
import { FiltersBar } from '../components/leads/FiltersBar';
import { LeadsTable } from '../components/leads/LeadsTable';
import { LeadForm } from '../components/leads/LeadForm';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1, limit: 10 });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);
  const activeFilters = { ...filters, search: debouncedSearch || undefined };

  const { data: leadsData, isLoading: leadsLoading, refetch } = useLeads(activeFilters);
  const { data: statsData, isLoading: statsLoading } = useLeadStats();

  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const [showCreate, setShowCreate] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Lead | null>(null);
  const [exporting, setExporting] = useState(false);

  const leads = leadsData?.data ?? [];
  const meta = leadsData?.meta;

  const handleFilterChange = (k: keyof LeadFilters, v: string) => {
    setFilters(f => ({ ...f, [k]: v || undefined, page: 1 }));
  };

  const handleReset = () => {
    setFilters({ sort: 'latest', page: 1, limit: 10 });
    setSearchInput('');
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await leadsApi.exportCSV();
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await deleteLead.mutateAsync(deleteConfirm._id);
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Welcome back, {user?.name} · <span className="capitalize">{user?.role}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} disabled={exporting} className="btn-secondary h-9 text-xs">
              <Download className="w-3.5 h-3.5" />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
            <button onClick={() => setShowCreate(true)} className="btn-primary h-9 text-xs">
              <Plus className="w-3.5 h-3.5" /> Add Lead
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsCards stats={statsData?.data} isLoading={statsLoading} />

        {/* Leads Card */}
        <div className="card">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">All Leads</h2>
              <button onClick={() => refetch()} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Refresh">
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
            <FiltersBar
              filters={filters}
              searchInput={searchInput}
              onSearchChange={setSearchInput}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          {leadsLoading ? (
            <PageLoader />
          ) : leads.length === 0 ? (
            <EmptyState
              action={<button onClick={() => setShowCreate(true)} className="btn-primary text-xs">+ Add First Lead</button>}
            />
          ) : (
            <>
              <LeadsTable
                leads={leads}
                onEdit={setEditLead}
                onDelete={setDeleteConfirm}
                onView={setViewLead}
              />
              {meta && meta.totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                  <Pagination meta={meta} onPageChange={p => setFilters(f => ({ ...f, page: p }))} />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add New Lead">
        <LeadForm
          onSubmit={async (data) => { await createLead.mutateAsync(data); setShowCreate(false); }}
          isLoading={createLead.isPending}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        {editLead && (
          <LeadForm
            initialData={editLead}
            onSubmit={async (data) => { await updateLead.mutateAsync({ id: editLead._id, data }); setEditLead(null); }}
            isLoading={updateLead.isPending}
            onCancel={() => setEditLead(null)}
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewLead} onClose={() => setViewLead(null)} title="Lead Details">
        {viewLead && (
          <div className="space-y-4">
            {[
              ['Name', viewLead.name],
              ['Email', viewLead.email],
              ['Status', viewLead.status],
              ['Source', viewLead.source],
              ['Notes', viewLead.notes || '—'],
              ['Created', new Date(viewLead.createdAt).toLocaleString()],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="label">{k}</p>
                <p className="text-sm">{v}</p>
              </div>
            ))}
            <button onClick={() => setViewLead(null)} className="btn-secondary w-full justify-center mt-2">Close</button>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Lead">
        {deleteConfirm && (
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleDelete} disabled={deleteLead.isPending} className="btn-danger">
                {deleteLead.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
