import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Home, User, PlusCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Close sidebar on route change or escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleNav = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const NavItem = ({ icon: Icon, label, onClick, isDanger }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm
        ${isDanger 
          ? 'text-red-600 hover:bg-red-50' 
          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  const drawerContent = (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <span className="text-lg font-semibold text-slate-800 tracking-tight pl-2">
            Menu
          </span>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <NavItem 
            icon={Home} 
            label="Home Feed" 
            onClick={() => handleNav('/')} 
          />
          
          {user && (
            <>
              <NavItem 
                icon={PlusCircle} 
                label="Dashboard" 
                onClick={() => handleNav('/dashboard')} 
              />
              <NavItem 
                icon={User} 
                label="My Profile" 
                onClick={() => handleNav(`/profile/${user.username}`)} 
              />
            </>
          )}
        </div>

        {/* Footer */}
        {user && (
          <div className="p-4 border-t border-slate-100">
            <div className="mb-4 px-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Signed in as</p>
              <p className="text-sm font-medium text-slate-900 truncate">@{user.username}</p>
            </div>
            <NavItem 
              icon={LogOut} 
              label="Log Out" 
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }} 
              isDanger 
            />
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Render drawer at document body level to escape backdrop-blur constraints */}
      {createPortal(drawerContent, document.body)}
    </>
  );
}
