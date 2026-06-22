import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Smile } from 'lucide-react';

const Picker = lazy(() => import('emoji-picker-react'));

export default function EmojiPickerButton({ onEmojiSelect, positionClass = 'bottom-full mb-2 right-0' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open emoji picker"
        aria-expanded={isOpen}
        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
      >
        <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 shadow-xl rounded-xl border border-slate-100 bg-white ${positionClass}`}
          // Ensure it doesn't break out of screen on mobile
          style={{ maxWidth: '90vw' }}
        >
          <Suspense fallback={
            <div className="w-[300px] h-[400px] flex items-center justify-center bg-slate-50 rounded-xl text-sm text-slate-400">
              <span className="animate-pulse">Loading emojis...</span>
            </div>
          }>
            <Picker
              onEmojiClick={(emojiData) => {
                onEmojiSelect(emojiData.emoji);
                // Optional: keep it open if user wants to add multiple emojis,
                // but closing it is usually preferred for a cleaner UX.
                // We'll close it to match standard behavior unless requested otherwise.
                setIsOpen(false);
              }}
              // Modern, clean UI settings
              lazyLoadEmojis={true}
              searchPlaceHolder="Search emojis..."
              theme="light"
              previewConfig={{ showPreview: false }} // Hides the bulky bottom preview bar
              width="100%"
              height="400px"
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
