import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="page-content">{children}</main>
    </div>
  );
}
