import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Heading2, Undo, Redo } from 'lucide-react';
import { useEffect } from 'react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const toggleClass = (isActive) => 
    `p-1.5 rounded transition-colors ${isActive ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={toggleClass(editor.isActive('bold'))}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={toggleClass(editor.isActive('italic'))}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={toggleClass(editor.isActive('strike'))}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      
      <div className="w-px h-5 bg-slate-300 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={toggleClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={toggleClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={toggleClass(editor.isActive('orderedList'))}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={toggleClass(editor.isActive('blockquote'))}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={toggleClass(editor.isActive('codeBlock'))}
        title="Code Block"
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-300 mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={toggleClass(false)}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={toggleClass(false)}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base prose-slate max-w-none focus:outline-none min-h-[250px] p-4',
      },
    },
  });

  // Sync content if it changes externally (e.g. when editing a different post)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-slate-200 focus-within:border-slate-300 transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
