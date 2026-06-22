import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SendHorizontal } from 'lucide-react';
import { getAvatarStyle, getInitials } from '../../utils/commentUtils';
import EmojiPickerButton from '../common/EmojiPickerButton';

/**
 * Root-comment input field rendered in Instagram style:
 * circular avatar on the left, borderless input on the right.
 */
export default function CommentInput({ user, value, onChange, onSubmit, loading, autoFocus = false }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  if (!user) {
    return (
      <div className="flex items-center gap-3 py-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0" />
        <button
          onClick={() => navigate('/auth')}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          <span className="font-semibold text-slate-700">Sign in</span> to comment…
        </button>
      </div>
    );
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !loading) onSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-3 py-3 mb-1">
      {/* User Avatar */}
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold select-none"
        style={getAvatarStyle(user.username)}
        aria-hidden="true"
      >
        {getInitials(user.username)}
      </div>

      {/* Input + Send */}
      <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 focus-within:border-slate-400 transition-colors">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a comment…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          aria-label="Add a comment"
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:opacity-50"
        />

        <EmojiPickerButton onEmojiSelect={(emoji) => onChange(value + emoji)} />

        {value.trim() && (
          <button
            type="submit"
            disabled={loading}
            aria-label="Post comment"
            className="text-slate-500 hover:text-black-600 disabled:opacity-50 transition-colors flex-shrink-0"
          >
            {loading
              ? <span className="w-4 h-4 block border-2 border-slate-400/30 border-t-slate-500 rounded-full animate-spin" />
              : <SendHorizontal className="w-4 h-4" />
            }
          </button>
        )}
      </div>
    </form>
  );
}
