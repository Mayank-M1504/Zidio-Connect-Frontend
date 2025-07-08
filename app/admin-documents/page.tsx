"use client";

import { useEffect, useState } from "react";
import { Eye, Download } from "lucide-react";
import { getAllAdminDocuments, getAllAdminCertificates, testDatabaseState, uploadStudentDocument, uploadStudentCertificate, updateDocumentStatus, updateCertificateStatus } from '../../lib/api';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>({});
  
  // Test upload states
  const [testFile, setTestFile] = useState<File | null>(null);
  const [testCertificateName, setTestCertificateName] = useState("");
  const [testCertificateFile, setTestCertificateFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    setDebugInfo({});
    
    try {
      // Check authentication
      const token = localStorage.getItem('token');
      setDebugInfo(prev => ({ ...prev, hasToken: !!token }));
      
      if (!token) {
        setError("Please log in to access this page. No authentication token found.");
        setDocuments([]);
        setCertificates([]);
        return;
      }

      // Decode token to check if it's valid
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const tokenData = JSON.parse(jsonPayload);
        setDebugInfo(prev => ({ ...prev, tokenData }));
        
        // Check if token is expired
        if (tokenData.exp && tokenData.exp * 1000 < Date.now()) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem('token');
          setDocuments([]);
          setCertificates([]);
          return;
        }
      } catch (tokenError) {
        setError("Invalid authentication token. Please log in again.");
        localStorage.removeItem('token');
        setDocuments([]);
        setCertificates([]);
        return;
      }

      // Test the database state endpoint first
      console.log("Testing database state...");
      const dbState = await testDatabaseState();
      console.log("Database state response:", dbState);
      
      setDebugInfo(prev => ({ 
        ...prev, 
        dbState: dbState
      }));

      // Test documents API
      console.log("Testing documents API...");
      const docsResponse = await getAllAdminDocuments();
      console.log("Admin documents response:", docsResponse);
      
      setDebugInfo(prev => ({ 
        ...prev, 
        docsResponseType: typeof docsResponse,
        docsIsArray: Array.isArray(docsResponse),
        docsResponse: docsResponse
      }));

      // Test certificates API
      console.log("Testing certificates API...");
      const certsResponse = await getAllAdminCertificates();
      console.log("Admin certificates response:", certsResponse);
      
      setDebugInfo(prev => ({ 
        ...prev, 
        certsResponseType: typeof certsResponse,
        certsIsArray: Array.isArray(certsResponse),
        certsResponse: certsResponse
      }));

      // Use the database state data if available
      if (dbState && dbState.documents) {
        setDocuments(dbState.documents);
        setCertificates(dbState.certificates || []);
      } else {
        // Fallback to original API calls
        const docs = Array.isArray(docsResponse) ? docsResponse : [];
        const certs = Array.isArray(certsResponse) ? certsResponse : [];
        setDocuments(docs);
        setCertificates(certs);
      }
      
    } catch (err: any) {
      console.error("Error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      if (err.response?.status === 401) {
        setError("Authentication failed. Please log in again. (401 Unauthorized)");
        localStorage.removeItem('token');
      } else if (err.response?.status === 403) {
        setError("Access denied. You don't have permission to view this page. (403 Forbidden)");
      } else {
        setError(err.message || "Failed to fetch data");
      }
      
      setDebugInfo(prev => ({ ...prev, error: err, errorStatus: err.response?.status }));
      setDocuments([]);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleTestDocumentUpload = async () => {
    if (!testFile) return;
    
    setUploading(true);
    try {
      await uploadStudentDocument(testFile, 'test_document');
      alert('Test document uploaded successfully!');
      setTestFile(null);
      fetchAll(); // Refresh the list
    } catch (err: any) {
      alert('Failed to upload test document: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleTestCertificateUpload = async () => {
    if (!testCertificateFile || !testCertificateName.trim()) return;
    
    setUploading(true);
    try {
      await uploadStudentCertificate(testCertificateFile, testCertificateName);
      alert('Test certificate uploaded successfully!');
      setTestCertificateFile(null);
      setTestCertificateName("");
      fetchAll(); // Refresh the list
    } catch (err: any) {
      alert('Failed to upload test certificate: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string, type: 'document' | 'certificate') => {
    try {
      if (type === 'document') {
        await updateDocumentStatus(id, newStatus);
        // Update local state
        setDocuments(prev => prev.map(doc => 
          doc.id === id ? { ...doc, status: newStatus } : doc
        ));
      } else {
        await updateCertificateStatus(id, newStatus);
        // Update local state
        setCertificates(prev => prev.map(cert => 
          cert.id === id ? { ...cert, status: newStatus } : cert
        ));
      }
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleViewDocument = (doc: any) => {
    const url = doc.url;
    const fileName = doc.fileName;
    const contentType = doc.contentType;
    
    // For images, open in new tab for viewing
    if (contentType && contentType.startsWith('image/')) {
      window.open(url, '_blank');
      return;
    }
    
    // For PDFs and other files, try to open in new tab first
    // If that fails, it will automatically download
    try {
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        // If popup is blocked, fall back to download
        handleDownloadDocument(doc);
      }
    } catch (error) {
      // If opening fails, download the file
      handleDownloadDocument(doc);
    }
  };

  const handleDownloadDocument = (doc: any) => {
    const url = doc.url;
    const fileName = doc.fileName;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Document Verification</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const token = localStorage.getItem('token');
              if (token) {
                try {
                  const base64Url = token.split('.')[1];
                  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                  }).join(''));
                  const tokenData = JSON.parse(jsonPayload);
                  alert(`Token Info:\nEmail: ${tokenData.sub || tokenData.email}\nRole: ${tokenData.role}\nExpires: ${new Date(tokenData.exp * 1000).toLocaleString()}`);
                } catch (e) {
                  alert('Invalid token format');
                }
              } else {
                alert('No token found. Please log in.');
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Check Login
          </button>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {/* Debug Information */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      {/* Test Upload Section */}
      <div className="mb-8 p-4 bg-blue-50 rounded border">
        <h3 className="font-semibold mb-4">Test Upload Section</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Test Document Upload</h4>
            <input
              type="file"
              onChange={(e) => setTestFile(e.target.files?.[0] || null)}
              className="mb-2"
            />
            <button
              onClick={handleTestDocumentUpload}
              disabled={!testFile || uploading}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Test Document'}
            </button>
          </div>
          <div>
            <h4 className="font-medium mb-2">Test Certificate Upload</h4>
            <input
              type="text"
              placeholder="Certificate name"
              value={testCertificateName}
              onChange={(e) => setTestCertificateName(e.target.value)}
              className="w-full mb-2 p-1 border rounded"
            />
            <input
              type="file"
              onChange={(e) => setTestCertificateFile(e.target.files?.[0] || null)}
              className="mb-2"
            />
            <button
              onClick={handleTestCertificateUpload}
              disabled={!testCertificateFile || !testCertificateName.trim() || uploading}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Test Certificate'}
            </button>
          </div>
        </div>
      </div>
      
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      
      <div className="mb-4 text-sm text-gray-600">
        Documents: {documents.length} | Certificates: {certificates.length}
      </div>
      
      <h2 className="text-xl font-semibold mt-8 mb-4">Documents ({documents.length})</h2>
      <div className="space-y-4">
        {documents.length === 0 && <div className="text-gray-500">No documents found.</div>}
        {documents.map((doc, index) => (
          <div key={doc.id || index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-lg">{doc.fileName || 'Unknown'}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-1 text-gray-600">{doc.type || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                      doc.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      doc.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.status || 'PENDING'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Profile:</span>
                    <span className="ml-1 text-gray-600">{doc.profileEmail || doc.profile?.email || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Size:</span>
                    <span className="ml-1 text-gray-600">{doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : 'Unknown'}</span>
                  </div>
                </div>
                {doc.uploadedAt && (
                  <div className="mt-2 text-xs text-gray-500">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                {doc.url && (
                  <>
                    <button
                      onClick={() => handleViewDocument(doc)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                      title="View/Download"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadDocument(doc)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleStatusUpdate(doc.id, 'APPROVED', 'document')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(doc.id, 'REJECTED', 'document')}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <h2 className="text-xl font-semibold mt-10 mb-4">Certificates ({certificates.length})</h2>
      <div className="space-y-4">
        {certificates.length === 0 && <div className="text-gray-500">No certificates found.</div>}
        {certificates.map((cert, index) => (
          <div key={cert.id || index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-lg">{cert.fileName || 'Unknown'}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-1 text-gray-600">{cert.certificateName || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                      cert.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      cert.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cert.status || 'PENDING'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Profile:</span>
                    <span className="ml-1 text-gray-600">{cert.profileEmail || cert.profile?.email || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Size:</span>
                    <span className="ml-1 text-gray-600">{cert.fileSize ? `${(cert.fileSize / 1024).toFixed(1)} KB` : 'Unknown'}</span>
                  </div>
                </div>
                {cert.uploadedAt && (
                  <div className="mt-2 text-xs text-gray-500">
                    Uploaded: {new Date(cert.uploadedAt).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                {cert.url && (
                  <>
                    <button
                      onClick={() => handleViewDocument(cert)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                      title="View/Download"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadDocument(cert)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleStatusUpdate(cert.id, 'APPROVED', 'certificate')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(cert.id, 'REJECTED', 'certificate')}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 