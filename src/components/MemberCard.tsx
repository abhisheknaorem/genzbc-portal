'use client';

import type { Member } from '@/types';

interface Props {
  member: Member;
  isAdmin: boolean;
  deleting: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export default function MemberCard({ member, isAdmin, deleting, onClick, onDelete }: Props) {
  const initials = member.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const colors: [string,string][] = [['#18181b','#3f3f46'],['#3b82f6','#2563eb'],['#10b981','#059669'],['#f59e0b','#d97706'],['#8b5cf6','#7c3aed']];
  const colorPair = colors[member.name.charCodeAt(0) % colors.length];

  return (
    <div className="card animate-premium-fade" style={{ padding: '32px', cursor: 'pointer', position: 'relative' }} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
        <div style={{ width: '60px', height: '60px', background: `linear-gradient(135deg, ${colorPair[0]}, ${colorPair[1]})`, borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: 'white', flexShrink: 0, boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)' }}>{initials}</div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 800, color: '#09090b', fontSize: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.03em' }}>{member.name}</div>
          {member.email && <div style={{ fontSize: '14px', color: '#71717a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px', fontWeight: 500 }}>{member.email}</div>}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
        {member.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#52525b', fontWeight: 500 }}>
            <svg style={{ color: '#a1a1aa' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.42 2 2 0 0 1 3.58 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9A16 16 0 0 0 12 13l.72-.72a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2z"/></svg>
            {member.phone}
          </div>
        )}
        {member.address && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#52525b', fontWeight: 500 }}>
            <svg style={{ flexShrink: 0, marginTop: '3px', color: '#a1a1aa' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{member.address}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f4f4f5', padding: '6px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, color: '#18181b' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M10.6 13a5 5 0 0 0 0-10"/></svg>
          {member._count?.transactions ?? 0} Transactions
        </div>
        <div style={{ display: 'flex', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
          {isAdmin && (
            <button className="btn-danger" disabled={deleting} onClick={onDelete} style={{ padding: '10px', borderRadius: '12px', background: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6' }} title="Delete member">
              {deleting ? <div className="spinner" style={{ width: '18px', height: '18px' }} /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>}
            </button>
          )}
          <button className="btn-secondary" onClick={onClick} style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 700 }}>Details</button>
        </div>
      </div>
    </div>
  );
}
