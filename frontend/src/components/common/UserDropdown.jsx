import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { getAvatarStyle, getInitials } from '../../utils/commentUtils';

export default function UserDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const username = user?.username || user?.email?.split('@')[0] || 'user';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
      >
        {user?.avatarUrl ? (
          <img 
            src={user.avatarUrl} 
            alt={username} 
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div 
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={getAvatarStyle(username)}
          >
            {getInitials(username)}
          </div>
        )}
        <span className="text-sm font-medium text-slate-700 hidden sm:block">
          @{username}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-slate-50 mb-1">
            <p className="text-xs text-slate-500 font-medium">Signed in as</p>
            <p className="text-sm font-semibold text-slate-900 truncate">@{username}</p>
          </div>
          
          <button
            onClick={() => handleNav(`/profile/${username}`)}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <User className="w-4 h-4 text-slate-400" />
            My Profile
          </button>
          
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
