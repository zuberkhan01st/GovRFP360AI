'use client'

import React, { useState } from 'react'
import { X, Download, Printer, Copy, FileText, Globe, Check } from 'lucide-react'
import DocumentGenerator from '@/lib/documentGenerator'

interface DocumentPreviewProps {
  isOpen: boolean
  onClose: () => void
  rfpData: {
    title: string
    content: string
    metadata: {
      projectName: string
      industry: string
      wordCount: number
      generatedAt: string
      organization?: string
    }
  }
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ isOpen, onClose, rfpData }) => {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'formatted'>('preview')

  if (!isOpen) return null

  const handleDownloadHTML = () => {
    DocumentGenerator.downloadHTML(rfpData)
  }

  const handleDownloadText = () => {
    DocumentGenerator.downloadText(rfpData)
  }

  const handlePrint = () => {
    DocumentGenerator.printDocument(rfpData)
  }

  const handleCopy = () => {
    DocumentGenerator.copyToClipboard(rfpData.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formattedHTML = DocumentGenerator.generateHTML(rfpData)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">RFP Document Preview</h2>
            <p className="text-gray-600 mt-1">{rfpData.metadata.projectName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'preview'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Globe className="w-4 h-4 inline mr-2" />
            Formatted Preview
          </button>
          <button
            onClick={() => setActiveTab('formatted')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'formatted'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Raw Content
          </button>
        </div>

        {/* Document Info */}
        <div className="p-4 bg-blue-50 border-b">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Industry:</span>
              <span className="ml-2 text-gray-900">{rfpData.metadata.industry}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Word Count:</span>
              <span className="ml-2 text-gray-900">{rfpData.metadata.wordCount.toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Generated:</span>
              <span className="ml-2 text-gray-900">
                {new Date(rfpData.metadata.generatedAt).toLocaleDateString('en-IN')}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Organization:</span>
              <span className="ml-2 text-gray-900">
                {rfpData.metadata.organization || 'Government of India'}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'preview' ? (
            <div className="h-full overflow-auto">
              <iframe
                srcDoc={formattedHTML}
                className="w-full h-full border-0"
                title="RFP Document Preview"
              />
            </div>
          ) : (
            <div className="h-full overflow-auto p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {rfpData.content}
              </pre>
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Ready to download your professionally formatted RFP document
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCopy}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Text
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            <button
              onClick={handleDownloadText}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download TXT
            </button>
            <button
              onClick={handleDownloadHTML}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download HTML
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentPreview
