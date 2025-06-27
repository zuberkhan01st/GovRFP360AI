'use client'

import React, { useState, useEffect } from 'react'
import { Check, X, Download, Eye, Copy, FileText } from 'lucide-react'

interface SuccessNotificationProps {
  isVisible: boolean
  onClose: () => void
  onPreview: () => void
  onDownload: () => void
  onCopy: () => void
  metadata: {
    projectName: string
    wordCount: number
    industry: string
  }
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  isVisible,
  onClose,
  onPreview,
  onDownload,
  onCopy,
  metadata
}) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Auto close after 30 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 30000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 w-96 bg-white rounded-lg shadow-xl border-l-4 border-green-500 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">
                RFP Generated Successfully!
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {metadata.projectName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 rounded p-2">
            <span className="font-medium text-gray-600">Word Count:</span>
            <div className="font-bold text-gray-900">
              {metadata.wordCount.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <span className="font-medium text-gray-600">Industry:</span>
            <div className="font-bold text-gray-900">
              {metadata.industry}
            </div>
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            onClick={onPreview}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </button>
          <button
            onClick={onDownload}
            className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
        </div>

        <div className="mt-2 flex space-x-2">
          <button
            onClick={handleCopy}
            className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copy Text
              </>
            )}
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
          Professional government-compliant RFP document ready
        </div>
      </div>
    </div>
  )
}

export default SuccessNotification
