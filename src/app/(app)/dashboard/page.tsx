'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { membersApi } from '@/lib/apiServices';
import type { Member } from '@/types';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [memberCount, setMemberCount] = useState(0);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    membersApi.list({ limit: 5 })
      .then((res) => { setMemberCount(res.data.meta.total); setRecentMembers(res.data.data); })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-premium-fade">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.04em' }}>Dashboard Overview</h1>
          <p style={{ color: '#71717a', fontSize: '15px', fontWeight: 500, marginTop: '4px' }}>Welcome back, {user?.name} 👋</p>
        </div>
        <button className="btn-primary" onClick={() => router.push('/members')} id="dashboard-manage-members">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
          Manage Members
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {[
          { label: 'Total Members', value: loading ? '—' : memberCount, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
          { label: 'Security Role', value: loading ? '—' : user?.role || '—', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '56px', height: '56px', background: '#f4f4f5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#18181b', flexShrink: 0 }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: '14px', color: '#71717a', fontWeight: 600, marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.04em', textTransform: 'capitalize' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.01)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.03em' }}>Recent Member Access</h2>
          <button className="btn-secondary" onClick={() => router.push('/members')} style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 700 }}>View Registry</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email Address</th><th>Phone</th><th>Transactions</th><th>Registration</th></tr></thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (<tr key={i}>{Array.from({ length: 5 }).map((_, j) => (<td key={j}><div className="skeleton" style={{ height: '18px', width: '80%' }} /></td>))}</tr>))
              ) : recentMembers.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#71717a', padding: '60px', fontWeight: 500 }}>No members registered yet. <button className="btn-primary" style={{ marginLeft: '12px' }} onClick={() => router.push('/members')}>Add Member</button></td></tr>
              ) : (
                recentMembers.map((m) => (
                  <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/members/${m.id}`)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#18181b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: 'white', flexShrink: 0 }}>{m.name[0].toUpperCase()}</div>
                        <span style={{ fontWeight: 700, color: '#09090b', letterSpacing: '-0.01em' }}>{m.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#52525b', fontWeight: 500 }}>{m.email || '—'}</td>
                    <td style={{ color: '#52525b', fontWeight: 500 }}>{m.phone || '—'}</td>
                    <td><span className="badge-credit" style={{ background: '#f4f4f5', color: '#18181b', borderColor: '#e4e4e7' }}>{m._count?.transactions ?? 0} Entry</span></td>
                    <td style={{ color: '#71717a', fontSize: '14px', fontWeight: 500 }}>{new Date(m.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
