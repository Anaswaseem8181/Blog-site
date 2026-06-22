import { memo } from 'react';
import { parseMentions } from '../../../utils/commentUtils';

/**
 * Renders comment text with @mention highlights.
 * Inline display so username and text sit on the same line (Instagram style).
 */
const CommentText = memo(({ text }) => (
  <span className="text-sm text-slate-800 leading-relaxed">
    {parseMentions(text).map((part) =>
      part.type === 'mention'
        ? <span key={part.key} className="text-blue-500 font-medium">{part.text}</span>
        : <span key={part.key}>{part.text}</span>
    )}
  </span>
));

CommentText.displayName = 'CommentText';
export default CommentText;
