'use client'

import React, { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import FontFamily from '@tiptap/extension-font-family'
import TiptapUnderline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Button } from '@/components/ui/button'
import { 
  X, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Download,
  Save,
  Palette,
  Type,
  Table as TableIcon,
  Highlighter,
  Loader2,
  RefreshCw
} from 'lucide-react'

interface DocumentEditorProps {
  isOpen: boolean
  onClose: () => void
  initialContent?: string
  title?: string
  onSave?: (content: string) => void
  formData?: any
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  isOpen,
  onClose,
  initialContent = '',
  title = 'Government RFP Document',
  onSave,
  formData
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showFontPicker, setShowFontPicker] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextStyle,
      Color,
      TiptapUnderline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      FontFamily.configure({
        types: ['textStyle'],
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none min-h-[500px] p-8 focus:outline-none bg-white government-document',
        style: 'white-space: pre-wrap; line-height: 1.8; font-family: "Times New Roman", serif; font-size: 16px; color: #1f2937;'
      },
    },
  })

  useEffect(() => {
    if (editor && initialContent) {
      let processedContent = initialContent
      
      if (initialContent.includes('<') && initialContent.includes('>')) {
        editor.commands.setContent(initialContent)
      } else {
        processedContent = initialContent
          .split('\n\n')
          .filter(para => para.trim())
          .map(paragraph => {
            const trimmed = paragraph.trim()
            
            if (trimmed.includes('**') || 
                (trimmed.includes(':') && trimmed.length < 100) ||
                (trimmed === trimmed.toUpperCase() && trimmed.length < 50 && trimmed.length > 5)) {
              const cleanText = trimmed.replace(/\*\*/g, '').replace(/^#+\s*/, '')
              return `<h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px; font-weight: bold;">${cleanText}</h2>`
            }
            
            if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
              return `<ul><li style="margin-bottom: 8px;">${trimmed.substring(1).trim()}</li></ul>`
            }
            
            if (/^\d+\./.test(trimmed)) {
              return `<ol><li style="margin-bottom: 8px;">${trimmed.replace(/^\d+\.\s*/, '')}</li></ol>`
            }
            
            return `<p style="margin-bottom: 15px; text-align: justify; line-height: 1.6;">${trimmed.replace(/\n/g, '<br>')}</p>`
          })
          .join('')
        
        editor.commands.setContent(processedContent)
      }
    }
  }, [editor, initialContent])

  if (!isOpen) return null

  const handleSave = () => {
    if (editor && onSave) {
      const content = editor.getHTML()
      onSave(content)
    }
  }

  const handleDownload = () => {
    if (editor) {
      const content = editor.getHTML()
      const blob = new Blob([content], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/\s+/g, '_')}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const colors = ['#000000', '#1a1a1a', '#4a4a4a', '#7a7a7a', '#d32f2f', '#f57c00', '#fbc02d', '#689f38', '#1976d2', '#7b1fa2', '#5d4037', '#455a64']

  const fonts = ['Times New Roman', 'Arial', 'Calibri', 'Georgia', 'Verdana', 'Helvetica']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <div className="flex space-x-1">
              <Button variant={activeTab === 'edit' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('edit')}>Edit</Button>
              <Button variant={activeTab === 'preview' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('preview')}>Preview</Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save</Button>
            <Button variant="outline" size="sm" onClick={handleDownload}><Download className="w-4 h-4 mr-2" />Download</Button>
            <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
          </div>
        </div>

        {activeTab === 'edit' && (
          <div className="border-b bg-gray-50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center border-r pr-3 mr-3">
                <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'bg-gray-200' : ''}><Bold className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'bg-gray-200' : ''}><Italic className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleUnderline().run()} className={editor?.isActive('underline') ? 'bg-gray-200' : ''}><Underline className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {activeTab === 'edit' ? (
            <div className="h-full">
              <EditorContent editor={editor} className="h-full" />
            </div>
          ) : (
            <div className="p-6 h-full overflow-auto">
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: editor?.getHTML() || initialContent }} />
            </div>
          )}
        </div>

        <div className="border-t p-4 bg-gray-50 rounded-b-lg">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">{activeTab === 'edit' ? 'Editing mode' : 'Preview mode'}</div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentEditor
