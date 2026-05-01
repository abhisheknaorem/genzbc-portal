'use client';

import { useState, FormEvent } from 'react';
import { membersApi } from '@/lib/apiServices';
import type { Member } from '@/types';
import toast from 'react-hot-toast';

interface Props { onClose: () => void; onCreated: (member: Member) => void; initialData?: Partial<Member>; memberId?: string; }

export default function AddMemberModal({ onClose, onCreated, initialData, memberId }: Props) {
  const isEdit = !!memberId;
  const [form, setForm] = useState({ name: initialData?.name || '', email: initialData?.email || '', phone: initialData?.phone || '', address: initialData?.address || '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setLoading(true);
    try {
      if (isEdit) {
        const res = await membersApi.update(memberId!, form);
        toast.success('Member updated'); onCreated(res.data.data);
      } else {
        const res = await membersApi.create(form);
        toast.success('Member created successfully'); onCreated(res.data.data);
      }
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save member');
    } finally { setLoading(false); }
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px 40px 0' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.04em' }}>{isEdit ? 'Edit Member' : 'New Member'}</h2>
            <p style={{ fontSize: '14px', color: '#71717a', marginTop: '4px', fontWeight: 500 }}>{isEdit ? 'Update existing member details' : 'Add a new member to your CRM'}</p>
          </div>
          <button onClick={onClose} style={{ background: '#f4f4f5', border: 'none', color: '#71717a', cursor: 'pointer', display: 'flex', padding: '10px', borderRadius: '14px', transition: 'all 0.2s' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div><label className="label" htmlFor="m-name">Full Name *</label><input id="m-name" type="text" className="input-field" placeholder="e.g. Alice Johnson" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label className="label" htmlFor="m-email">Email Address</label><input id="m-email" type="email" className="input-field" placeholder="alice@example.com" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} /></div>
            <div><label className="label" htmlFor="m-phone">Phone Number</label><input id="m-phone" type="tel" className="input-field" placeholder="+1-555-0101" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
          </div>
          <div><label className="label" htmlFor="m-address">Physical Address</label><textarea id="m-address" className="input-field" placeholder="123 Main St, New York..." value={form.address} onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))} rows={3} style={{ resize: 'none' }} /></div>
          <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, padding: '14px' }}>Cancel</button>
            <button id="submit-member-btn" type="submit" className="btn-primary" disabled={loading} style={{ flex: 1.5, padding: '14px' }}>
              {loading ? <><div className="spinner" style={{ width: '18px', height: '18px', borderTopColor: 'white' }} />Processing...</> : (isEdit ? 'Save Changes' : 'Create Member')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
