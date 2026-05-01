'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { membersApi } from '@/lib/apiServices';
import type { Member } from '@/types';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import MemberCard from '@/components/MemberCard';
import AddMemberModal from '@/components/AddMemberModal';

export default function MembersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const limit = 12;

  useEffect(() => {
    setLoading(true);
    membersApi.list({ page, limit, search })
      .then((res) => { setMembers(res.data.data); setTotal(res.data.meta.total); setTotalPages(res.data.meta.totalPages); })
      .catch(() => toast.error('Failed to load members'))
      .finally(() => setLoading(false));
  }, [page, search]);

  function handleSearch(e: FormEvent) { e.preventDefault(); setPage(1); setSearch(searchInput); }

  async function handleDelete(id: string) {
    if (!confirm('Delete this member? All transactions and terms will be removed.')) return;
    setDeleting(id);
    try { await membersApi.delete(id); toast.success('Member deleted'); setMembers(p => p.filter(m => m.id !== id)); setTotal(t => t - 1); }
    catch { toast.error('Failed to delete member'); }
    finally { setDeleting(null); }
  }

  return (
    <div className="animate-premium-fade">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.04em' }}>Member Directory</h1>
          <p style={{ color: '#71717a', fontSize: '15px', fontWeight: 500, marginTop: '4px' }}>Managing {total} active member{total !== 1 ? 's' : ''}</p>
        </div>
        {user?.role === 'admin' && (
          <button id="add-member-btn" className="btn-primary" onClick={() => setShowModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add New Member
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: '32px', display: 'flex', gap: '12px', maxWidth: '560px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a1a1aa' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input id="member-search" type="text" className="input-field" placeholder="Search by name, email, or phone number..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} style={{ paddingLeft: '44px' }} />
        </div>
        <button type="submit" className="btn-secondary" style={{ flexShrink: 0, fontWeight: 700 }}>Search</button>
        {search && <button type="button" className="btn-secondary" style={{ flexShrink: 0, color: '#ef4444' }} onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>Reset</button>}
      </form>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}><div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '18px' }} /><div style={{ flex: 1 }}><div className="skeleton" style={{ height: '18px', width: '60%', marginBottom: '10px' }} /><div className="skeleton" style={{ height: '14px', width: '80%' }} /></div></div>
              <div className="skeleton" style={{ height: '44px', marginTop: '24px', borderRadius: '12px' }} />
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '120px 24px', background: '#ffffff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px', filter: 'grayscale(1)', opacity: 0.5 }}>👥</div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#09090b', marginBottom: '8px', letterSpacing: '-0.02em' }}>{search ? 'No results found' : 'No members found'}</h3>
          <p style={{ color: '#71717a', fontSize: '15px', marginBottom: '32px', fontWeight: 500 }}>{search ? `We couldn't find any matches for "${search}"` : 'Start your directory by adding your first member.'}</p>
          {!search && user?.role === 'admin' && <button className="btn-primary" onClick={() => setShowModal(true)}>Add your first member</button>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {members.map((member) => (
            <MemberCard key={member.id} member={member} isAdmin={user?.role === 'admin'} deleting={deleting === member.id}
              onClick={() => router.push(`/members/${member.id}`)} onDelete={() => handleDelete(member.id)} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '48px' }}>
          <button className="btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '10px 20px', borderRadius: '12px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Prev
          </button>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#18181b', background: '#f4f4f5', padding: '10px 18px', borderRadius: '12px' }}>
            Page {page} of {totalPages}
          </div>
          <button className="btn-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '10px 20px', borderRadius: '12px' }}>
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px' }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      )}

      {showModal && <AddMemberModal onClose={() => setShowModal(false)} onCreated={(m) => { setMembers(p => [m, ...p]); setTotal(t => t + 1); setShowModal(false); }} />}
    </div>
  );
}
