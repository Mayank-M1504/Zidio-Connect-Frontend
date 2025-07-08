"use client"

import { useState } from 'react'
import { Eye, Download, CheckCircle, Clock, XCircle, FileText, Image, File } from 'lucide-react'

interface DocumentViewerProps {
  document: {
    id: number
    fileName: string
    fileSize: number
    contentType: string
    url: string
    status: string
    uploadedAt: string
    type?: string
    certificateName?: string
  }
  onStatusChange?: (documentId: number, newStatus: string) => void
  isAdmin?: boolean
  onClose?: () => void
}

export default function DocumentViewer({ document, onStatusChange, isAdmin = false, onClose }: DocumentViewerProps) {
  const [previewError, setPreviewError] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'PENDING':
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'PENDING':
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Verified'
      case 'REJECTED':
        return 'Rejected'
      case 'PENDING':
      default:
        return 'Verification Pending'
    }
  }

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return <Image className="w-5 h-5" />
    } else if (contentType === 'application/pdf') {
      return <FileText className="w-5 h-5" />
    } else {
      return <File className="w-5 h-5" />
    }
  }

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(document.id, newStatus)
    }
  }

  const openDocument = () => {
    if (document.contentType.startsWith('image/')) {
      // For images, open in a new tab
      window.open(document.url, '_blank')
    } else {
      // For PDFs and other files, try to open in new tab
      window.open(document.url, '_blank')
    }
  }

  // Get the display name for the document type
  const getDisplayName = () => {
    if (document.certificateName) {
      return document.certificateName
    } else if (document.type) {
      return document.type.replace('_', ' ').toUpperCase()
    }
    return 'Document'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-6xl max-h-[95vh] w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold">{document.fileName}</h3>
          <div className="flex items-center space-x-2">
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition-colors shadow"
            >
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-6 max-h-[80vh] overflow-auto">
          {previewError ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-red-600 font-semibold mb-2">Failed to load preview</p>
              <p className="text-gray-500 mb-4">This file could not be displayed here. You can still open it in a new tab.</p>
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
              >
                Open in New Tab
              </a>
            </div>
          ) : document.contentType.startsWith('image/') ? (
            <img
              src={document.url}
              alt={document.fileName}
              className="max-w-full h-auto mx-auto"
              onError={() => setPreviewError(true)}
            />
          ) : document.contentType === 'application/pdf' ? (
            <iframe
              src={document.url}
              className="w-full h-[80vh] border-0"
              title={document.fileName}
              onError={() => setPreviewError(true)}
            />
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Preview not available for this file type</p>
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
              >
                Open File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 