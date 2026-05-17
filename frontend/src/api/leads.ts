import api from './axios';
import { ApiResponse, Lead, LeadFilters, LeadStats } from '../types';

export const leadsApi = {
  getLeads: (filters: LeadFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
    return api.get<ApiResponse<Lead[]>>(`/leads?${params}`);
  },

  getLead: (id: string) => api.get<ApiResponse<Lead>>(`/leads/${id}`),

  createLead: (data: Partial<Lead>) => api.post<ApiResponse<Lead>>('/leads', data),

  updateLead: (id: string, data: Partial<Lead>) => api.put<ApiResponse<Lead>>(`/leads/${id}`, data),

  deleteLead: (id: string) => api.delete<ApiResponse<null>>(`/leads/${id}`),

  getStats: () => api.get<ApiResponse<LeadStats>>('/leads/stats'),

  exportCSV: async () => {
    const res = await api.get('/leads/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads-export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
