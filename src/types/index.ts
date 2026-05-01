export interface User { id: string; name: string; email: string; role: 'admin' | 'staff'; createdAt: string; }

export interface Member {
  id: string; name: string; email?: string; phone?: string; address?: string;
  createdBy: string; createdAt: string; updatedAt: string;
  creator?: { id: string; name: string };
  _count?: { transactions: number };
}

export interface TransactionFile {
  id: string; transactionId: string; fileUrl: string; fileKey: string;
  fileType: string; fileName: string; fileSize: number; uploadedAt: string;
}

export interface Transaction {
  id: string; memberId: string; amount: number | string; type: 'credit' | 'debit';
  description?: string; date: string; createdBy: string; createdAt: string;
  files: TransactionFile[];
  creator?: { id: string; name: string };
  member?: { id: string; name: string };
}

export interface TermsCondition { id: string; memberId: string; content: string; version: number; createdAt: string; }

export interface PaginatedResponse<T> {
  success: boolean; data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number; };
}

export interface ApiResponse<T> { success: boolean; message?: string; data: T; }

export interface TransactionFilters {
  page?: number; limit?: number; type?: 'credit' | 'debit' | '';
  dateFrom?: string; dateTo?: string; minAmount?: string; maxAmount?: string;
}

export interface MemberFilters { page?: number; limit?: number; search?: string; }
