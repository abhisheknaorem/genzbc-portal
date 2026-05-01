import api from './api';
import { Member, Transaction, TermsCondition, PaginatedResponse, ApiResponse, MemberFilters, TransactionFilters } from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: { id: string; name: string; email: string; role: string }; accessToken: string }>>('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<ApiResponse<{ id: string; name: string; email: string; role: string }>>('/auth/me'),
};

export const membersApi = {
  list: (filters: MemberFilters = {}) => api.get<PaginatedResponse<Member>>('/members', { params: filters }),
  get: (id: string) => api.get<ApiResponse<Member>>(`/members/${id}`),
  create: (data: { name: string; email?: string; phone?: string; address?: string }) =>
    api.post<ApiResponse<Member>>('/members', data),
  update: (id: string, data: { name?: string; email?: string; phone?: string; address?: string }) =>
    api.put<ApiResponse<Member>>(`/members/${id}`, data),
  delete: (id: string) => api.delete(`/members/${id}`),
};

export const transactionsApi = {
  list: (memberId: string, filters: TransactionFilters = {}) =>
    api.get<PaginatedResponse<Transaction>>(`/members/${memberId}/transactions`, { params: filters }),
  create: (data: { memberId: string; amount: number; type: 'credit' | 'debit'; description?: string; date: string }) =>
    api.post<ApiResponse<Transaction>>('/transactions', data),
  get: (id: string) => api.get<ApiResponse<Transaction>>(`/transactions/${id}`),
  uploadFile: (transactionId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<ApiResponse<{ id: string; fileUrl: string; fileName: string }>>(
      `/transactions/${transactionId}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },
};

export const termsApi = {
  get: (memberId: string) =>
    api.get<ApiResponse<{ current: TermsCondition | null; history: TermsCondition[] }>>(`/members/${memberId}/terms`),
  create: (memberId: string, content: string) =>
    api.post<ApiResponse<TermsCondition>>(`/members/${memberId}/terms`, { content }),
};
