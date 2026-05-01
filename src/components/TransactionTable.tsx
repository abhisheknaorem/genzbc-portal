'use client';

import type { Transaction, TransactionFilters } from '@/types';

interface Props {
  transactions: Transaction[]; loading: boolean; filters: TransactionFilters;
  onFiltersChange: (f: TransactionFilters) => void;
  total: number; page: number; totalPages: number; onPageChange: (p: number) => void;
}

export default function TransactionTable({ transactions, loading, filters, onFiltersChange, total, page, totalPages, onPageChange }: Props) {
  function formatAmount(amount: number | string) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', padding: '24px', background: '#ffffff', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ flex: '1 1 140px' }}>
          <label className="label">Entry Type</label>
          <select className="input-field" value={filters.type || ''} onChange={(e) => onFiltersChange({ ...filters, type: e.target.value as '' | 'credit' | 'debit', page: 1 })} style={{ padding: '12px 16px' }}>
            <option value="">All Types</option><option value="credit">Credit Only</option><option value="debit">Debit Only</option>
          </select>
        </div>
        <div style={{ flex: '1 1 160px' }}><label className="label">Start Date</label><input type="date" className="input-field" value={filters.dateFrom || ''} onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value, page: 1 })} style={{ padding: '12px 16px' }} /></div>
        <div style={{ flex: '1 1 160px' }}><label className="label">End Date</label><input type="date" className="input-field" value={filters.dateTo || ''} onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value, page: 1 })} style={{ padding: '12px 16px' }} /></div>
        <div style={{ flex: '1 1 120px' }}><label className="label">Min Amount</label><input type="number" className="input-field" placeholder="$ 0.00" value={filters.minAmount || ''} onChange={(e) => onFiltersChange({ ...filters, minAmount: e.target.value, page: 1 })} style={{ padding: '12px 16px' }} min="0" /></div>
        <div style={{ flex: '1 1 120px' }}><label className="label">Max Amount</label><input type="number" className="input-field" placeholder="$ Max" value={filters.maxAmount || ''} onChange={(e) => onFiltersChange({ ...filters, maxAmount: e.target.value, page: 1 })} style={{ padding: '12px 16px' }} min="0" /></div>
        {(filters.type || filters.dateFrom || filters.dateTo || filters.minAmount || filters.maxAmount) && (
          <div style={{ display: 'flex', alignItems: 'flex-end', flex: '0 0 auto' }}>
            <button className="btn-secondary" style={{ padding: '14px 20px', color: '#ef4444', borderColor: '#fee2e2' }} onClick={() => onFiltersChange({ page: 1 })}>Reset Filters</button>
          </div>
        )}
      </div>

      <div style={{ fontSize: '14px', color: '#71717a', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        {loading ? 'Retrieving records...' : `${total} Transaction record${total !== 1 ? 's' : ''}`}
      </div>

      <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>Reference Date</th><th>Classification</th><th>Amount</th><th>Description</th><th>Supporting Docs</th><th>Recorded By</th></tr></thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (<td key={j}><div className="skeleton" style={{ height: '18px', width: j === 2 ? '80px' : '90%' }} /></td>))}</tr>
                ))
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#71717a', padding: '80px', fontWeight: 500 }}>No transactional data found within selected parameters.</td></tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '14px', color: '#71717a', fontWeight: 500 }}>{new Date(tx.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td><span className={tx.type === 'credit' ? 'badge-credit' : 'badge-debit'}>{tx.type === 'credit' ? '↑' : '↓'} {tx.type.toUpperCase()}</span></td>
                    <td style={{ fontWeight: 800, color: tx.type === 'credit' ? '#059669' : '#dc2626', whiteSpace: 'nowrap', fontSize: '15px' }}>{tx.type === 'debit' ? '−' : '+'}{formatAmount(tx.amount)}</td>
                    <td style={{ color: '#52525b', maxWidth: '280px', fontSize: '14px', fontWeight: 500 }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                        {tx.description || <span style={{ color: '#a1a1aa', fontStyle: 'italic' }}>No description provided</span>}
                      </span>
                    </td>
                    <td>
                      {tx.files.length > 0 ? (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {tx.files.map((f) => (
                            <a key={f.id} href={f.fileUrl} target="_blank" rel="noopener noreferrer" title={f.fileName}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f4f4f5', color: '#18181b', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', border: '1px solid #e4e4e7', transition: 'all 0.2s' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                              Open
                            </a>
                          ))}
                        </div>
                      ) : <span style={{ color: '#a1a1aa', fontSize: '14px' }}>—</span>}
                    </td>
                    <td style={{ color: '#71717a', fontSize: '14px', fontWeight: 500 }}>{tx.creator?.name || 'Unknown'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
          <button className="btn-secondary" disabled={page === 1} onClick={() => onPageChange(page - 1)} style={{ padding: '10px 18px', borderRadius: '12px' }}>Prev</button>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 700, color: '#18181b', background: '#f4f4f5', padding: '10px 18px', borderRadius: '12px' }}>Page {page} of {totalPages}</div>
          <button className="btn-secondary" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} style={{ padding: '10px 18px', borderRadius: '12px' }}>Next</button>
        </div>
      )}
    </div>
  );
}
