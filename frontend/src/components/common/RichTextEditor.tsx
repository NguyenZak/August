"use client";

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import Placeholder from '@tiptap/extension-placeholder';
import MediaLibraryModal from './MediaLibraryModal';

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Link as LinkIcon,
    Heading1,
    Heading2,
    Heading3,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Highlighter,
    Image as ImageIcon,
    Table as TableIcon,
    Type,
    Minus,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const MenuBar = ({ editor, onOpenMediaLibrary }: { editor: any, onOpenMediaLibrary: () => void }) => {
    if (!editor) {
        return null;
    }

    const addLink = () => {
        const url = window.prompt('Nhập URL:');
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        onOpenMediaLibrary();
    };

    const insertTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-100 bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10 rounded-t-[1.5rem]">
            {/* Typography */}
            <div className="flex bg-white/50 p-1 rounded-xl border border-gray-100 gap-0.5">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded-lg transition-all ${editor.isActive('bold') ? 'bg-black text-[#dafc69]' : 'hover:bg-gray-100 text-gray-500'}`}
                    title="In đậm"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded-lg transition-all ${editor.isActive('italic') ? 'bg-black text-[#dafc69]' : 'hover:bg-gray-100 text-gray-500'}`}
                    title="In nghiêng"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded-lg transition-all ${editor.isActive('underline') ? 'bg-black text-[#dafc69]' : 'hover:bg-gray-100 text-gray-500'}`}
                    title="Gạch chân"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    className={`p-1.5 rounded-lg transition-all ${editor.isActive('highlight') ? 'bg-black text-[#dafc69]' : 'hover:bg-gray-100 text-gray-500'}`}
                    title="Highlight"
                >
                    <Highlighter className="w-4 h-4" />
                </button>
            </div>

            {/* Alignments */}
            <div className="flex bg-white/50 p-1 rounded-xl border border-gray-100 gap-0.5">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-1.5 rounded-lg transition-all ${editor.isActive({ textAlign: 'left' }) ? 'bg-black text-[#dafc69]' : 'hover:bg-gray-100 text-gray-500'}`}
                    title="Căn trái"
                >
                    <AlignLeft className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-1.5 rounded-lg transition-all ${editor.isActive({ textAlign: 'center' }) ? 'bg-black text-[#dafc69]' : 'hover:bg-gray-100 text-gray-500'}`}
                    title="Căn giữa"
                >
                    <AlignCenter className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-1.5 rounded-lg transition-all ${editor.isActive({ textAlign: 'right' }) ? 'bg-black text-[#dafc69]' : 'hover:bg-gray-100 text-gray-500'}`}
                    title="Căn phải"
                >
                    <AlignRight className="w-4 h-4" />
                </button>
            </div>

            {/* Headings */}
            <div className="flex bg-white/50 p-1 rounded-xl border border-gray-100 gap-0.5">
                {[1, 2, 3].map((level) => (
                    <button
                        key={level}
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: level as any }).run()}
                        className={`p-1.5 rounded-lg transition-all ${editor.isActive('heading', { level }) ? 'bg-black text-[#dafc69]' : 'hover:bg-gray-100 text-gray-500'}`}
                        title={`Tiêu đề ${level}`}
                    >
                        {level === 1 ? <Heading1 className="w-4 h-4" /> : level === 2 ? <Heading2 className="w-4 h-4" /> : <Heading3 className="w-4 h-4" />}
                    </button>
                ))}
            </div>

            {/* Lists & Objects */}
            <div className="flex bg-white/50 p-1 rounded-xl border border-gray-100 gap-0.5">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded-lg transition-all ${editor.isActive('bulletList') ? 'bg-black text-[#dafc69]' : 'hover:bg-gray-100 text-gray-500'}`}
                    title="Danh sách dấu chấm"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded-lg transition-all ${editor.isActive('orderedList') ? 'bg-black text-[#dafc69]' : 'hover:bg-gray-100 text-gray-500'}`}
                    title="Danh sách số"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={addLink}
                    className={`p-1.5 rounded-lg transition-all ${editor.isActive('link') ? 'bg-black text-[#dafc69]' : 'hover:bg-gray-100 text-gray-500'}`}
                    title="Thêm liên kết"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={addImage}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-all"
                    title="Chèn ảnh"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={insertTable}
                    className={`p-1.5 rounded-lg transition-all ${editor.isActive('table') ? 'bg-black text-[#dafc69]' : 'hover:bg-gray-100 text-gray-500'}`}
                    title="Chèn bảng"
                >
                    <TableIcon className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-grow" />

            {/* History */}
            <div className="flex bg-white/50 p-1 rounded-xl border border-gray-100 gap-0.5">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-all"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-all"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const [isMediaModalOpen, setIsMediaModalOpen] = React.useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#a8cc2c] underline cursor-pointer',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-2xl max-w-full h-auto border border-gray-100 shadow-lg my-4',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-fixed w-full my-4 border border-gray-200 rounded-lg overflow-hidden',
                },
            }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({
                placeholder: placeholder || 'Bắt đầu viết nội dung dự án tại đây...',
            }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-8 font-medium text-gray-900 leading-relaxed',
            },
        },
    });

    React.useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    return (
        <div className="border border-gray-100 rounded-[2rem] overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <MenuBar editor={editor} onOpenMediaLibrary={() => setIsMediaModalOpen(true)} />
            <div className="max-h-[500px] overflow-y-auto">
                <EditorContent editor={editor} />
            </div>

            <MediaLibraryModal
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                onSelect={(url) => {
                    if (editor) {
                        editor.chain().focus().setImage({ src: url }).run();
                    }
                }}
                title="Chèn ảnh vào nội dung"
            />

            <style jsx global>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                    font-weight: 400;
                    font-style: italic;
                }
                .ProseMirror {
                    outline: none !important;
                }
                .ProseMirror p {
                    margin-bottom: 0.75em;
                }
                .ProseMirror h1 { font-size: 2rem; font-weight: 900; margin-top: 1.5em; margin-bottom: 0.75em; }
                .ProseMirror h2 { font-size: 1.5rem; font-weight: 900; margin-top: 1.25em; margin-bottom: 0.5em; }
                .ProseMirror h3 { font-size: 1.25rem; font-weight: 900; margin-top: 1em; margin-bottom: 0.5em; }
                .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 2em;
                    margin-bottom: 1em;
                }
                .ProseMirror ol {
                    list-style-type: decimal;
                    padding-left: 2em;
                    margin-bottom: 1em;
                }
                .ProseMirror blockquote {
                    padding-left: 1.5em;
                    border-left: 4px solid #dafc69;
                    font-style: italic;
                    color: #4b5563;
                    margin: 1.5em 0;
                }
                .ProseMirror table {
                    width: 100%;
                }
                .ProseMirror th, .ProseMirror td {
                    border: 1px solid #e5e7eb;
                    padding: 0.75rem;
                    text-align: left;
                }
                .ProseMirror th {
                    background-color: #f9fafb;
                    font-weight: bold;
                }
                .ProseMirror .selectedCell:after {
                    background: rgba(218, 252, 105, 0.2);
                }
            `}</style>
        </div>
    );
}
