import DOMPurify from 'dompurify';

/**
 * Displays post content with proper formatting safely rendering HTML
 */
export default function PostDetailsContent({ content }) {
  const safeHtml = DOMPurify.sanitize(content);
  
  return (
    <div 
      className="prose prose-slate prose-lg max-w-none prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl leading-relaxed"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
