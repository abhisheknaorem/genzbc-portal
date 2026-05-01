'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
  { href: '/members', label: 'Members', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    toast.success('Logged out successfully');
    router.push('/login');
  }

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0 8px 48px' }}>
        {/* <div style={{ width: '42px', height: '42px', background: '#18181b', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2.5" /></svg>
        </div> */}
        <span style={{ fontWeight: 800, fontSize: '20px', color: '#09090b', letterSpacing: '-0.04em' }}>GenZ BITCOIN TREASURY</span>
      </div>
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '0 8px 32px' }} />

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {NAV.map((item) => {
          const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`}>
              {item.icon}{item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {user && (
          <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', background: '#f4f4f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: '#18181b', flexShrink: 0, border: '1px solid rgba(0,0,0,0.05)' }}>
              {user.name[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: '#71717a', textTransform: 'capitalize', fontWeight: 500 }}>{user.role}</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="nav-item" style={{ color: '#ef4444', padding: '14px 18px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}
