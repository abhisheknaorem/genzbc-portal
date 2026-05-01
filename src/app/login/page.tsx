'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to GenZ BITCOIN TREASURY');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.04) 0%, transparent 40%), radial-gradient(circle at 85% 85%, rgba(139, 92, 246, 0.04) 0%, transparent 40%), #fcfcfd', padding: '24px' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />
      <div className="animate-premium-fade" style={{ width: '100%', maxWidth: '460px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ width: '72px', height: '72px', background: '#18181b', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 20px 40px -8px rgba(0,0,0,0.2)', transform: 'rotate(-1deg)' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#09090b', letterSpacing: '-0.05em', marginBottom: '12px' }}>GenZ BITCOIN TREASURY</h1>
          <p style={{ color: '#71717a', fontSize: '16px', fontWeight: '500', letterSpacing: '-0.01em' }}>Premium management for elite teams</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '32px', padding: '48px', boxShadow: '0 32px 64px -16px rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '28px' }}>
              <label className="label" htmlFor="email">Work Email</label>
              <input id="email" type="email" className="input-field" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus required />
            </div>
            <div style={{ marginBottom: '36px' }}>
              <label className="label" htmlFor="password">Security Code</label>
              <div style={{ position: 'relative' }}>
                <input id="password" type={showPassword ? 'text' : 'password'} className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required style={{ paddingRight: '52px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: '#f4f4f5', border: 'none', cursor: 'pointer', color: '#71717a', display: 'flex', padding: '8px', borderRadius: '10px', transition: 'all 0.2s' }}>
                  {showPassword ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
                </button>
              </div>
            </div>
            <button id="login-btn" type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '700', borderRadius: '16px' }}>
              {loading ? <><div className="spinner" style={{ width: '20px', height: '20px', borderTopColor: 'white' }} />Authenticating...</> : 'Continue to Dashboard'}
            </button>
          </form>
          {/* <div style={{ marginTop: '40px', padding: '24px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '20px' }}>
            <div style={{ fontWeight: 800, color: '#09090b', marginBottom: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.02em' }}>
              <svg style={{ color: '#6366f1' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              Access Identity
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: '#71717a', fontWeight: 500 }}>Administrator</span> <code style={{ fontWeight: 700, color: '#18181b' }}>admin@atangcrm.com</code></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: '#71717a', fontWeight: 500 }}>Operator</span> <code style={{ fontWeight: 700, color: '#18181b' }}>staff@atangcrm.com</code></div>
            </div>
            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f0f0f0', fontSize: '11px', color: '#a1a1aa', textAlign: 'center', fontWeight: 500 }}>Password: <span style={{ color: '#71717a', fontWeight: 700 }}>Admin@123</span> / <span style={{ color: '#71717a', fontWeight: 700 }}>Staff@123</span></div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
