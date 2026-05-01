'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfcfd' }}>
        <div className="spinner" style={{ width: '32px', height: '32px', borderTopColor: '#18181b' }} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="main-layout">
      <Sidebar />
      <main className="page-content">{children}</main>
    </div>
  );
}
