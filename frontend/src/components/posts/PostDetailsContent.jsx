/**
 * Displays post content with proper formatting
 */
export default function PostDetailsContent({ content }) {
  return (
    <div className="text-slate-700 leading-loose text-lg space-y-6 whitespace-pre-wrap font-serif">
      {content}
    </div>
  );
}
