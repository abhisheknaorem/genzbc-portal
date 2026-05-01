'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { membersApi, transactionsApi } from '@/lib/apiServices';
import type { Member, Transaction, TransactionFilters } from '@/types';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import TransactionTable from '@/components/TransactionTable';
import AddTransactionModal from '@/components/AddTransactionModal';
import AddMemberModal from '@/components/AddMemberModal';

type Tab = 'transactions' | 'terms';

const FIXED_TERMS = [
  { label: 'PURPOSE', content: 'FOR FINANCIAL FREEDOM (15 YEARS LEPTANA EVERY MONTH KHUDINGI BITCOIN LEISINBA).', icon: '🎯' },
  { label: 'ALTERNATIVE COINS', content: 'BTC NTABA ATOPA ALTERNATIVE COIN SING ESHA2GI OWN INTEREST TA HAIRIBA COOL WALLET ASHI USE TWBA YAI.', icon: '🪙' },
  { label: 'MINIMUM INVESTMENT', content: '₹500/- PER MONTH.', icon: '💰' },
  { label: 'DURATION', content: '15 YEARS FROM LAUNCH DATE.', icon: '⏳' },
  { label: 'BITCOIN STORE', content: 'COLD WALLET.', icon: '🛡️' },
  { label: 'PRIVATE KEYS', content: 'PRIVATE KEYS WITH APP ACCESS TO ALL THE MEMBERS.', icon: '🔑' },
  { label: 'RISK & LIABILITY', content: 'Acknowledges risks including volatility, irreversible losses due to lost private keys, and total loss potential.', icon: '⚠️' },
  { label: 'PROFITS SHARING', content: 'EQUAL SHARING TO ALL THE MEMBERS.', icon: '📊' },
  { 
    label: 'IMMATURITY', 
    content: [
      'a). MATURITY PHADRINGEIDA TOKLAGADI MEMBER ADUNA SIP/ MONTH TWRAMBA TOTAL AMOUNT ADUGI 50% KHKTAMK PHANGANI ADUGA GAINING/PROFITS AMOUNT DI AMTA PHANGDBA.',
      'b). KARIGUMBA MEMBER MARAKTA ANABA YAORABASU SIP DI ADUMK HUNGANI ADUGA ANABANA MARAM OIRAGA "BITCOIN FUND" AMTA LOUTHOKPAGI WAPHAM YAODE ACCEPT MEMBER ADUNA "DEATH" OIRABADI MEMBER ADUNA SIP TWRAMBA TOTAL AMOUNT+ GAINING AMOUNT PUMNAMK MATURITY PHADRABASU PITHOKANI.',
      'c). KARIGUMBA MEMBER MARAKTAGI HOSPITALISED MINIMUM 30 DAYS TAGI TADANA LEIRABDI MEMBER DUGI MONTLY SIP AMOUNT ADU ANABA PHADRIPHWBA HUNDRABASU YAI.'
    ], 
    icon: '🏥' 
  },
  { label: 'SIP RULE', content: 'EVERY MONTH KHUDINGI SIP TWBADA NEGLECT CHARABADI MEMBER ADUGI PREVIOUS MONTH GI SIP AMOUNT ADU MEMBER MAYAMDA DISTRIBUTION CHAP MANANA YENTHOKANI.', icon: '📏' },
  { label: 'BITCOIN BUYING RULE', content: 'KARIGUMBA MEMBER MARAKTAGI STATE -MANIPUR ASHI GI MAPANDA LEIRABADI BTC LEIBA NUMITA PARTICIPATION TWDRABASU YAI ADUGA STATE-MANIPUR ASHIGI MANUNGDA LEIRAGA YUMDANA OUT OF STATION OIRABADI HAIRIBA MEMBER ADU YAODRIPHWBA BTC LEIBA YADE.', icon: '🛒' },
  { label: 'ADDITIONAL INVESTMENT', content: 'MEMBER MARAKTAGI HAPNINGBA AMOUNT HAPCHABA YAGANI.', icon: '➕' },
  { label: 'CUSTODY RISKS', content: 'Loss of private keys results in irreversible loss of funds.', icon: '🔒' },
  { label: 'VOLATILITY', content: 'Bitcoin prices can fluctuate heavily, risking total loss of invested capital.', icon: '📈' },
  { label: 'PAYMENT METHOD', content: 'SIP AMOUNT ADU ONLY GPAY DA TWGANI WITH "GBTGC" LABELLED TWRAGA.', icon: '📱' },
];

export default function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [member, setMember] = useState<Member | null>(null);
  const [memberLoading, setMemberLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('transactions');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txMeta, setTxMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [txFilters, setTxFilters] = useState<TransactionFilters>({ page: 1, limit: 10 });
  const [txLoading, setTxLoading] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    setMemberLoading(true);
    membersApi.get(id).then((res) => setMember(res.data.data)).catch(() => toast.error('Member not found')).finally(() => setMemberLoading(false));
  }, [id]);

  const loadTransactions = useCallback(() => {
    setTxLoading(true);
    transactionsApi.list(id, txFilters)
      .then((res) => { setTransactions(res.data.data); setTxMeta({ total: res.data.meta.total, page: res.data.meta.page, totalPages: res.data.meta.totalPages }); })
      .catch(() => toast.error('Failed to load transactions'))
      .finally(() => setTxLoading(false));
  }, [id, txFilters]);

  useEffect(() => { loadTransactions(); }, [loadTransactions]);


  const colors: [string, string][] = [['#18181b', '#3f3f46'], ['#3b82f6', '#2563eb'], ['#10b981', '#059669']];
  const colorPair = member ? colors[member.name.charCodeAt(0) % colors.length] : colors[0];

  return (
    <div className="animate-premium-fade">
      <button onClick={() => router.back()} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '14px', marginBottom: '32px', borderRadius: '12px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Back to Dashboard
      </button>

      {memberLoading ? (
        <div className="card" style={{ padding: '32px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="skeleton" style={{ width: '64px', height: '64px', borderRadius: '18px' }} />
          <div style={{ flex: 1 }}><div className="skeleton" style={{ height: '24px', width: '240px', marginBottom: '12px' }} /><div className="skeleton" style={{ height: '16px', width: '360px' }} /></div>
        </div>
      ) : member ? (
        <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '72px', height: '72px', background: `linear-gradient(135deg, ${colorPair[0]}, ${colorPair[1]})`, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: 'white', flexShrink: 0, boxShadow: '0 12px 24px -6px rgba(0,0,0,0.1)' }}>
                {member.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.04em' }}>{member.name}</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '10px' }}>
                  {member.email && <span style={{ fontSize: '14px', color: '#52525b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> {member.email}</span>}
                  {member.phone && <span style={{ fontSize: '14px', color: '#52525b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.42 2 2 0 0 1 3.58 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9A16 16 0 0 0 12 13l.72-.72a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2z"/></svg> {member.phone}</span>}
                  {member.address && <span style={{ fontSize: '14px', color: '#52525b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {member.address}</span>}
                </div>
                <div style={{ marginTop: '12px', fontSize: '13px', color: '#71717a', fontWeight: 500 }}>
                  Active since {new Date(member.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · Managed by {member.creator?.name}
                </div>
              </div>
            </div>
            {isAdmin && <button className="btn-secondary" onClick={() => setShowEditModal(true)} style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '12px' }}>✏️ Edit Profile</button>}
          </div>
        </div>
      ) : null}

      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: '32px' }}>
        {(['transactions', 'terms'] as Tab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 24px', fontSize: '15px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', borderBottom: `3px solid ${activeTab === tab ? '#18181b' : 'transparent'}`, color: activeTab === tab ? '#18181b' : '#71717a', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)', letterSpacing: '-0.02em' }}>
            {tab === 'transactions' ? `Transactions (${txMeta.total})` : 'Terms & Conditions'}
          </button>
        ))}
      </div>

      {activeTab === 'transactions' && (
        <div className="animate-premium-fade">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.03em' }}>Transaction History</h2>
            {isAdmin && <button id="add-tx-btn" className="btn-primary" onClick={() => setShowTxModal(true)}>+ Add Transaction</button>}
          </div>
          <TransactionTable transactions={transactions} loading={txLoading} filters={txFilters} onFiltersChange={(f) => setTxFilters(p => ({ ...p, ...f }))} total={txMeta.total} page={txMeta.page} totalPages={txMeta.totalPages} onPageChange={(p) => setTxFilters(prev => ({ ...prev, page: p }))} />
        </div>
      )}

      {activeTab === 'terms' && (
        <div className="animate-premium-fade">
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.03em' }}>Terms & Conditions</h2>
            <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px', fontWeight: 500 }}>Standard rules and regulations for all members.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {FIXED_TERMS.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: '24px', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#18181b', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>{item.label}</h3>
                </div>
                <div style={{ fontSize: '14px', color: '#3f3f46', lineHeight: 1.6, fontWeight: 500 }}>
                  {Array.isArray(item.content) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {item.content.map((c, i) => <p key={i}>{c}</p>)}
                    </div>
                  ) : (
                    <p>{item.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '40px', padding: '24px', background: '#fef2f2', borderRadius: '20px', border: '1px solid #fee2e2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#991b1b', marginBottom: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <h4 style={{ fontSize: '15px', fontWeight: 800 }}>Critical Notice</h4>
            </div>
            <p style={{ fontSize: '13px', color: '#991b1b', fontWeight: 500, lineHeight: 1.5 }}>
              These terms are fixed and binding for all members of the GenZ Bitcoin Treasury. Any violation of these rules may result in immediate suspension of membership as per the SIP Rule.
            </p>
          </div>
        </div>
      )}

      {showTxModal && member && <AddTransactionModal memberId={member.id} onClose={() => setShowTxModal(false)} onCreated={(tx) => { setTransactions(p => [tx, ...p]); setTxMeta(m => ({ ...m, total: m.total + 1 })); setShowTxModal(false); }} />}
      {showEditModal && member && <AddMemberModal memberId={member.id} initialData={member} onClose={() => setShowEditModal(false)} onCreated={(updated) => { setMember(updated); setShowEditModal(false); }} />}
    </div>
  );
}
