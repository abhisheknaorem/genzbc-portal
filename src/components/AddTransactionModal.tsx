'use client';

import { useState, FormEvent, useRef } from 'react';
import { transactionsApi } from '@/lib/apiServices';
import type { Transaction } from '@/types';
import toast from 'react-hot-toast';

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

interface Props { memberId: string; onClose: () => void; onCreated: (tx: Transaction) => void; }

export default function AddTransactionModal({ memberId, onClose, onCreated }: Props) {
  const [form, setForm] = useState({ amount: '', type: 'credit' as 'credit' | 'debit', description: '', date: new Date().toISOString().split('T')[0] });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setFileError('');
    if (!f) { setFile(null); return; }
    if (!ALLOWED_TYPES.includes(f.type)) { setFileError('Invalid type. Allowed: JPEG, PNG, WebP, GIF, PDF'); setFile(null); return; }
    if (f.size > MAX_SIZE) { setFileError('File too large. Max 10MB'); setFile(null); return; }
    setFile(f);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) { toast.error('Enter a valid amount'); return; }
    setLoading(true);
    try {
      const txRes = await transactionsApi.create({ memberId, amount: parseFloat(form.amount), type: form.type, description: form.description, date: new Date(form.date).toISOString() });
      const tx = txRes.data.data;
      if (file) {
        try { const r = await transactionsApi.uploadFile(tx.id, file); tx.files = [r.data.data as never]; }
        catch { toast.error('Transaction saved but file upload failed'); }
      }
      toast.success('Transaction recorded successfully'); onCreated(tx);
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create transaction');
    } finally { setLoading(false); }
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '540px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px 40px 0' }}>
          <div><h2 style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.04em' }}>Record Transaction</h2><p style={{ fontSize: '14px', color: '#71717a', marginTop: '4px', fontWeight: 500 }}>Add a credit or debit entry for this member</p></div>
          <button onClick={onClose} style={{ background: '#f4f4f5', border: 'none', color: '#71717a', cursor: 'pointer', display: 'flex', padding: '10px', borderRadius: '14px' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label className="label">Entry Type</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {(['credit', 'debit'] as const).map((t) => (
                <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '14px', border: '2px solid', cursor: 'pointer', fontWeight: 700, fontSize: '14px', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    ...(form.type === t ? (t === 'credit' ? { background: '#ecfdf5', color: '#059669', borderColor: '#10b981' } : { background: '#fef2f2', color: '#dc2626', borderColor: '#ef4444' }) : { background: '#ffffff', color: '#71717a', borderColor: '#e4e4e7' })
                  }}>
                  {t === 'credit' ? '↑ Credit Entry' : '↓ Debit Entry'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label className="label" htmlFor="tx-amount">Amount *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#a1a1aa', fontSize: '14px', fontWeight: 700 }}>₹</span>
                <input id="tx-amount" type="number" className="input-field" placeholder="0.00" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm(p => ({ ...p, amount: e.target.value }))} style={{ paddingLeft: '36px' }} required />
              </div>
            </div>
            <div><label className="label" htmlFor="tx-date">Transaction Date *</label><input id="tx-date" type="date" className="input-field" value={form.date} onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))} required /></div>
          </div>

          <div><label className="label" htmlFor="tx-desc">Description</label><input id="tx-desc" type="text" className="input-field" placeholder="e.g. Annual subscription renewal" value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} maxLength={500} /></div>

          <div>
            <label className="label">Verification Document (optional)</label>
            <div onClick={() => fileRef.current?.click()} style={{ border: `2px dashed ${file ? '#18181b' : '#e4e4e7'}`, borderRadius: '20px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: file ? 'rgba(0,0,0,0.01)' : '#ffffff', transition: 'all 0.3s' }}>
              {file ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', color: '#18181b' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>{file.name}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = ''; }} style={{ background: '#18181b', border: 'none', color: '#ffffff', cursor: 'pointer', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', transition: 'transform 0.2s' }}>×</button>
                </div>
              ) : (
                <div>
                  <svg style={{ margin: '0 auto 14px', color: '#a1a1aa' }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <p style={{ fontSize: '15px', color: '#18181b', fontWeight: 700 }}>Upload payment proof</p>
                  <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px', fontWeight: 500 }}>Drag and drop or click to browse</p>
                </div>
              )}
            </div>
            {fileError && <p style={{ color: '#e11d48', fontSize: '13px', marginTop: '10px', fontWeight: 600 }}>{fileError}</p>}
            <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={handleFile} />
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, padding: '14px' }}>Cancel</button>
            <button id="submit-tx-btn" type="submit" className="btn-primary" disabled={loading} style={{ flex: 1.5, padding: '14px' }}>
              {loading ? <><div className="spinner" style={{ width: '18px', height: '18px', borderTopColor: 'white' }} />Syncing...</> : 'Confirm Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
