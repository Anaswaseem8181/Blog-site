import Navbar from './Navbar';

export default function Layout({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-300 selection:text-slate-900">
      <Navbar user={user} onLogout={onLogout} />
      <main className="py-12">
        {children}
      </main>
    </div>
  );
}
