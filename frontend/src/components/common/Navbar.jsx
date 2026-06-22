import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, PlusCircle } from 'lucide-react';
import Container from './Container';
import Sidebar from './Sidebar';
import UserDropdown from './UserDropdown';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/60">
      <Container>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Sidebar user={user} onLogout={onLogout} />
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate('/')}
            >
            <BookOpen className="h-5 w-5 text-slate-700 transition-colors group-hover:text-slate-900" />
            <span className="text-lg font-semibold text-slate-800 tracking-tight">
              Bloger
            </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <PlusCircle className="h-4 w-4" /> Dashboard
                </button>
                <UserDropdown user={user} onLogout={onLogout} />
              </>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
