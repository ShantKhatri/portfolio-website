"use client"
import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  className = "",
  placeholder = "Write your content using Markdown..."
}) => {
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  
  // Handle textarea selection to know where to insert the image
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelectionStart(target.selectionStart);
    setSelectionEnd(target.selectionEnd);
  };
  
  // Insert image at cursor position
  const insertImage = (imageUrl: string) => {
    const imageMarkdown = `![Image](${imageUrl})`;
    const newValue = value.substring(0, selectionStart) + 
                     imageMarkdown + 
                     value.substring(selectionEnd);
                     
    onChange(newValue);
    setShowImageUploader(false);
  };
  
  const insertMarkdown = (tag: string) => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let insertion = '';
    switch(tag) {
      case 'bold':
        insertion = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        insertion = `*${selectedText || 'italic text'}*`;
        break;
      case 'code':
        insertion = `\`${selectedText || 'code'}\``;
        break;
      case 'link':
        insertion = `[${selectedText || 'link text'}](url)`;
        break;
      case 'h1':
        insertion = `# ${selectedText || 'Heading 1'}`;
        break;
      case 'h2':
        insertion = `## ${selectedText || 'Heading 2'}`;
        break;
      case 'h3':
        insertion = `### ${selectedText || 'Heading 3'}`;
        break;
      case 'ul':
        insertion = `- ${selectedText || 'List item'}`;
        break;
      case 'ol':
        insertion = `1. ${selectedText || 'List item'}`;
        break;
      case 'blockquote':
        insertion = `> ${selectedText || 'Blockquote'}`;
        break;
    }
    
    const newValue = value.substring(0, start) + insertion + value.substring(end);
    onChange(newValue);
    
    // Set the cursor position after operation
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertion.length, start + insertion.length);
    }, 0);
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 mb-2 bg-gray-800 p-2 rounded-t-md">
        <button 
          type="button" 
          onClick={() => insertMarkdown('bold')}
          className="p-1.5 hover:bg-gray-700 rounded"
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button 
          type="button" 
          onClick={() => insertMarkdown('italic')}
          className="p-1.5 hover:bg-gray-700 rounded"
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button 
          type="button" 
          onClick={() => insertMarkdown('code')}
          className="p-1.5 hover:bg-gray-700 rounded"
          title="Code"
        >
          <span className="font-mono">{`<>`}</span>
        </button>
        <button 
          type="button" 
          onClick={() => insertMarkdown('link')}
          className="p-1.5 hover:bg-gray-700 rounded"
          title="Link"
        >
          <span className="underline">Link</span>
        </button>
        <div className="h-5 w-px bg-gray-600 mx-1"></div>
        <button 
          type="button" 
          onClick={() => insertMarkdown('h1')}
          className="p-1.5 hover:bg-gray-700 rounded"
          title="Heading 1"
        >
          <span className="font-bold text-lg">H1</span>
        </button>
        <button 
          type="button" 
          onClick={() => insertMarkdown('h2')}
          className="p-1.5 hover:bg-gray-700 rounded"
          title="Heading 2"
        >
          <span className="font-bold">H2</span>
        </button>
        <button 
          type="button" 
          onClick={() => insertMarkdown('h3')}
          className="p-1.5 hover:bg-gray-700 rounded"
          title="Heading 3"
        >
          <span className="font-bold text-sm">H3</span>
        </button>
        <div className="h-5 w-px bg-gray-600 mx-1"></div>
        <button 
          type="button" 
          onClick={() => insertMarkdown('ul')}
          className="p-1.5 hover:bg-gray-700 rounded"
          title="Unordered List"
        >
          • List
        </button>
        <button 
          type="button" 
          onClick={() => insertMarkdown('ol')}
          className="p-1.5 hover:bg-gray-700 rounded"
          title="Ordered List"
        >
          1. List
        </button>
        <button 
          type="button" 
          onClick={() => insertMarkdown('blockquote')}
          className="p-1.5 hover:bg-gray-700 rounded"
          title="Blockquote"
        >
          &quot; Quote
        </button>
        <div className="h-5 w-px bg-gray-600 mx-1"></div>
        <button 
          type="button" 
          onClick={() => setShowImageUploader(true)}
          className="p-1.5 hover:bg-gray-700 rounded flex items-center"
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4 mr-1" />
          Image
        </button>
      </div>

      {/* Image Uploader */}
      {showImageUploader && (
        <div className="absolute z-10 top-12 left-0 right-0 mt-1 shadow-xl">
          <ImageUploader 
            onImageUploaded={insertImage}
            onCancel={() => setShowImageUploader(false)}
          />
        </div>
      )}

      {/* Markdown Editor Textarea */}
      <textarea
        id="markdown-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelect}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-b-md px-4 py-2 font-mono"
        rows={15}
      />
    </div>
  );
};

export default MarkdownEditor;