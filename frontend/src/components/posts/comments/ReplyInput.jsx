import { memo, useRef, useEffect } from 'react';

import EmojiPickerButton from '../../common/EmojiPickerButton';

const ReplyInput = memo(({ username, value, onChange, onSubmit, onCancel, loading }) => {
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(); }
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div
      className="flex items-center gap-2 mt-3 ml-10"
      role="form"
      aria-label={`Reply to ${username}`}
    >
      <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 focus-within:border-slate-400 transition-colors">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Reply to @${username}…`}
          aria-label={`Reply to @${username}`}
          disabled={loading}
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:opacity-50"
        />
        <EmojiPickerButton onEmojiSelect={(emoji) => onChange(value + emoji)} />
      </div>
      <button
        onClick={onSubmit}
        disabled={!value.trim() || loading}
        aria-label="Post reply"
        className="text-xs font-semibold text-balck-500 hover:text-blue-600 disabled:opacity-40 transition-colors px-1"
      >
        {loading ? '…' : 'Post'}
      </button>
      <button
        onClick={onCancel}
        aria-label="Cancel reply"
        className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
});

ReplyInput.displayName = 'ReplyInput';
export default ReplyInput;
