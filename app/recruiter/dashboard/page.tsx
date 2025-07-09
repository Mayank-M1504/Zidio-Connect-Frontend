"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  LogOut,
  Bell,
  Settings,
  Briefcase,
  Users,
  Calendar,
  User,
  Building,
  Shield,
  BookOpen,
  AlertCircle,
} from "lucide-react"
import { getCurrentRecruiterProfile, RecruiterProfileData, updateRecruiterProfile, getRecruiterDocuments, deleteRecruiterDocument } from "@/lib/api"
import DocumentViewer from "@/components/DocumentViewer"

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState("jobs")
  const [showJobForm, setShowJobForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  // Replace recruiterProfile state with a local editable state for the form fields
  const [profileForm, setProfileForm] = useState<RecruiterProfileData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Add recruiter documents state and modal logic
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null)
  const fileInputRefs = {
    registration: useRef<HTMLInputElement>(null),
    gst: useRef<HTMLInputElement>(null),
    pan: useRef<HTMLInputElement>(null),
    business: useRef<HTMLInputElement>(null),
  }

  const handleDocumentUploadClick = (type: string) => {
    setUploadingDocType(type)
    if (fileInputRefs[type as keyof typeof fileInputRefs]?.current) {
      fileInputRefs[type as keyof typeof fileInputRefs].current!.value = ""
      fileInputRefs[type as keyof typeof fileInputRefs].current!.click()
    }
  }

  // Add state for upload messages per document type
  const [uploadMessages, setUploadMessages] = useState<{ [key: string]: { type: 'success' | 'error', text: string } | null }>({});

  const handleDocumentFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDocType(type);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    try {
      const res = await fetch(
        "http://localhost:8080/api/recruiter/profile/documents/upload",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUploadMessages((prev) => ({ ...prev, [type]: { type: 'success', text: `${type} uploaded successfully!` } }));
        // Optionally refresh document list here
        getRecruiterDocuments().then((docs) => setRecruiterDocuments(docs));
      } else {
        setUploadMessages((prev) => ({ ...prev, [type]: { type: 'error', text: data.error || `Failed to upload ${type}` } }));
      }
    } catch (err) {
      setUploadMessages((prev) => ({ ...prev, [type]: { type: 'error', text: `Failed to upload ${type}` } }));
    } finally {
      setUploadingDocType(null);
      // Remove the message after 3 seconds
      setTimeout(() => {
        setUploadMessages((prev) => ({ ...prev, [type]: null }));
      }, 3000);
    }
  };

  const [recruiterDocuments, setRecruiterDocuments] = useState<any[]>([]);
  const [docLoading, setDocLoading] = useState(true);

  useEffect(() => {
    getCurrentRecruiterProfile()
      .then((data) => setProfileForm(data))
      .finally(() => setLoading(false));
    // Fetch recruiter documents
    getRecruiterDocuments()
      .then((docs) => setRecruiterDocuments(docs))
      .finally(() => setDocLoading(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    setSaveError(null)
    try {
      await updateRecruiterProfile(profileForm)
      setSaveSuccess(true)
    } catch (err: any) {
      setSaveError(err.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  // Dummy data
  const postedJobs = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      department: "Engineering",
      location: "Bangalore",
      type: "Internship",
      stipend: "₹25,000/month",
      applicants: 45,
      posted: "2024-01-15",
      status: "Active",
    },
    {
      id: 2,
      title: "Backend Developer",
      department: "Engineering",
      location: "Mumbai",
      type: "Full-time",
      stipend: "₹12,00,000/year",
      applicants: 32,
      posted: "2024-01-10",
      status: "Active",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      type: "Internship",
      stipend: "₹20,000/month",
      applicants: 28,
      posted: "2024-01-08",
      status: "Closed",
    },
  ]

  const applicants = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      college: "MIT",
      jobTitle: "Frontend Developer Intern",
      appliedDate: "2024-01-16",
      status: "Applied",
      resume: "john_doe_resume.pdf",
      skills: ["React", "JavaScript", "CSS"],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      college: "Stanford",
      jobTitle: "Frontend Developer Intern",
      appliedDate: "2024-01-17",
      status: "Shortlisted",
      resume: "jane_smith_resume.pdf",
      skills: ["React", "TypeScript", "Node.js"],
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@example.com",
      college: "Berkeley",
      jobTitle: "Backend Developer",
      appliedDate: "2024-01-12",
      status: "Rejected",
      resume: "mike_wilson_resume.pdf",
      skills: ["Python", "Django", "PostgreSQL"],
    },
    {
      id: 4,
      name: "Emily Brown",
      email: "emily@example.com",
      college: "Harvard",
      jobTitle: "UI/UX Designer",
      appliedDate: "2024-01-14",
      status: "Shortlisted",
      resume: "emily_brown_resume.pdf",
      skills: ["Figma", "Adobe XD", "Prototyping"],
    },
  ]

  const [jobForm, setJobForm] = useState({
    title: "",
    department: "",
    location: "",
    type: "internship",
    stipend: "",
    duration: "",
    description: "",
    requirements: "",
  })

  const handleJobFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle job posting logic here
    setShowJobForm(false)
    setJobForm({
      title: "",
      department: "",
      location: "",
      type: "internship",
      stipend: "",
      duration: "",
      description: "",
      requirements: "",
    })
  }

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || applicant.status.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "shortlisted":
        return "text-green-600 bg-green-100"
      case "rejected":
        return "text-red-600 bg-red-100"
      default:
        return "text-blue-600 bg-blue-100"
    }
  }

  // Add delete handler
  const handleDeleteDocument = async (docId: number, type: string) => {
    try {
      await deleteRecruiterDocument(docId);
      setUploadMessages((prev) => ({ ...prev, [type]: { type: 'success', text: 'Document deleted successfully!' } }));
      getRecruiterDocuments().then((docs) => setRecruiterDocuments(docs));
    } catch (err) {
      setUploadMessages((prev) => ({ ...prev, [type]: { type: 'error', text: 'Failed to delete document' } }));
    } finally {
      setTimeout(() => {
        setUploadMessages((prev) => ({ ...prev, [type]: null }));
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Recruiter Dashboard</h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {profileForm.firstName} {profileForm.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs Posted</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applicants</p>
                <p className="text-2xl font-bold text-gray-900">105</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "profile" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "jobs" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>My Jobs</span>
                </button>
                <button
                  onClick={() => setActiveTab("applicants")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "applicants" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Applicants</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <>
                <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                  {/* Basic Information */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={profileForm.firstName || ""}
                          onChange={handleInputChange}
                          name="firstName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={profileForm.lastName || ""}
                          onChange={handleInputChange}
                          name="lastName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={profileForm.email || ""}
                          onChange={handleInputChange}
                          name="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profileForm.phone || ""}
                          onChange={handleInputChange}
                          name="phone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Recruiter Role</label>
                        <select
                          value={profileForm.recruiterRole || ""}
                          onChange={handleInputChange}
                          name="recruiterRole"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option>HR Manager</option>
                          <option>Hiring Specialist</option>
                          <option>Founder</option>
                          <option>Tech Lead</option>
                          <option>Talent Acquisition Manager</option>
                          <option>CEO</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                        <input
                          type="url"
                          value={profileForm.linkedinProfile || ""}
                          onChange={handleInputChange}
                          name="linkedinProfile"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Company Information</h3>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company/Organization Name
                          </label>
                          <input
                            type="text"
                            value={profileForm.companyName || ""}
                            onChange={handleInputChange}
                            name="companyName"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                          <input
                            type="url"
                            value={profileForm.companyWebsite || ""}
                            onChange={handleInputChange}
                            name="companyWebsite"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://yourcompany.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                        <textarea
                          value={profileForm.companyAddress || ""}
                          onChange={handleInputChange}
                          name="companyAddress"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Complete office address including city, state, country, and ZIP"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                        <textarea
                          value={profileForm.companyDescription || ""}
                          onChange={handleInputChange}
                          name="companyDescription"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe your company, culture, services, or products..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">STIN / Registration Number</label>
                        <input
                          type="text"
                          value={profileForm.stinNumber || ""}
                          onChange={handleInputChange}
                          name="stinNumber"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter STIN or company registration number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Update Profile"}
                    </button>
                  </div>
                  {saveSuccess && (
                    <div className="mt-4 text-green-600 text-center">Profile updated successfully!</div>
                  )}
                  {saveError && <div className="mt-4 text-red-600 text-center">{saveError}</div>}
                </form>

                {/* Company Documents Section - redesigned */}
                <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Company Documents</h3>
                  {/* Document Types */}
                  {[
                    {
                      key: 'registration',
                      label: 'Company Registration Certificate',
                      icon: <Building className="w-8 h-8 text-gray-400 mx-auto mb-2" />,
                      description: 'Certificate of Incorporation, MSME, Shop & Establishment License',
                      accept: '.pdf,.jpg,.jpeg,.png',
                      typeLabel: 'Certificate of Incorporation',
                    },
                    {
                      key: 'gst',
                      label: 'GST Registration Certificate',
                      icon: <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />,
                      description: 'Required for tax verification and invoicing',
                      accept: '.pdf,.jpg,.jpeg,.png',
                      typeLabel: 'GST Certificate',
                    },
                    {
                      key: 'pan',
                      label: 'PAN Card (Company or Individual)',
                      icon: <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />,
                      description: 'Company PAN or Individual PAN for verification',
                      accept: '.pdf,.jpg,.jpeg,.png',
                      typeLabel: 'PAN Card',
                    },
                    {
                      key: 'business',
                      label: 'Business License or Trade License',
                      icon: <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />,
                      description: 'Required for regulated sectors (healthcare, finance, etc.)',
                      accept: '.pdf,.jpg,.jpeg,.png',
                      typeLabel: 'Business License',
                    },
                  ].map((docType) => (
                    <div key={docType.key} className="mb-8">
                      <h4 className="text-md font-medium text-gray-800 mb-3">{docType.label}</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Upload Box */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center">
                          {docType.icon}
                          <p className="text-sm text-gray-600 mb-2">Upload {docType.label}</p>
                          <p className="text-xs text-gray-500 mb-3">{docType.description}</p>
                          <div className="flex flex-col items-center gap-2 w-full">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleDocumentUploadClick(docType.key)}
                                className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 font-medium"
                              >
                                Choose File
                              </button>
                              <button
                                type="button"
                                onClick={() => fileInputRefs[docType.key as keyof typeof fileInputRefs].current?.files?.length && handleDocumentFileChange({ target: fileInputRefs[docType.key as keyof typeof fileInputRefs].current } as any, docType.key)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded hover:shadow-lg font-medium disabled:opacity-50"
                                disabled={!(fileInputRefs[docType.key as keyof typeof fileInputRefs].current && fileInputRefs[docType.key as keyof typeof fileInputRefs].current.files && fileInputRefs[docType.key as keyof typeof fileInputRefs].current.files.length)}
                              >
                                Update
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 min-h-[1.5em]">
                              {fileInputRefs[docType.key as keyof typeof fileInputRefs].current && fileInputRefs[docType.key as keyof typeof fileInputRefs].current.files && fileInputRefs[docType.key as keyof typeof fileInputRefs].current.files.length
                                ? fileInputRefs[docType.key as keyof typeof fileInputRefs].current.files[0].name
                                : "No file chosen"}
                            </div>
                            {uploadMessages[docType.key] && (
                              <div className={`text-xs mt-1 ${uploadMessages[docType.key]?.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{uploadMessages[docType.key]?.text}</div>
                            )}
                          </div>
                          <input
                            type="file"
                            accept={docType.accept}
                            ref={fileInputRefs[docType.key as keyof typeof fileInputRefs]}
                            style={{ display: 'none' }}
                            onChange={e => {
                              // Just force a re-render to update the file name display
                              setUploadingDocType(uploadingDocType => uploadingDocType === docType.key ? null : docType.key);
                            }}
                          />
                        </div>
                        {/* Uploaded Documents List */}
                        <div>
                          <h5 className="text-sm font-semibold text-gray-700 mb-2">Uploaded {docType.label}s</h5>
                          {docLoading ? (
                            <div className="text-gray-400 text-sm">Loading...</div>
                          ) : (
                            recruiterDocuments.filter(doc => doc.type === docType.key).length === 0 ? (
                              <div className="text-gray-400 text-sm">No document uploaded yet.</div>
                            ) : (
                              recruiterDocuments.filter(doc => doc.type === docType.key).map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-2 border border-gray-200">
                                  <div>
                                    <div className="font-medium text-gray-900 text-sm">{doc.fileName}</div>
                                    <div className="text-xs text-gray-500">{(doc.fileSize/1024/1024).toFixed(2)} MB &middot; {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' : doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{doc.status}</span>
                                    <button title="View" onClick={() => { setSelectedDocument(doc); setShowDocumentModal(true); }} className="text-blue-600 hover:text-blue-800"><Eye className="w-4 h-4" /></button>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900"><Download className="w-4 h-4" /></a>
                                    <button title="Delete" onClick={() => handleDeleteDocument(doc.id, docType.key)} className="text-red-600 hover:text-red-800"><XCircle className="w-4 h-4" /></button>
                                  </div>
                                </div>
                              ))
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </>
            )}
            {/* Jobs Tab */}
            {activeTab === "jobs" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                {/* Header with Post Job Button */}
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Posted Jobs</h2>
                  <button
                    onClick={() => setShowJobForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post New Job</span>
                  </button>
                </div>

                {/* Job Listings */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Job Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applicants
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {postedJobs.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                <div className="text-sm text-gray-500">{job.type}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.department}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.applicants}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  job.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {job.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Applicants Tab */}
            {activeTab === "applicants" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search applicants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Applicants List */}
                <div className="space-y-4">
                  {filteredApplicants.map((applicant) => (
                    <div
                      key={applicant.id}
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{applicant.name}</h3>
                          <p className="text-gray-600 mb-1">{applicant.email}</p>
                          <p className="text-sm text-gray-500 mb-2">{applicant.college}</p>
                          <p className="text-sm font-medium text-blue-600">{applicant.jobTitle}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(applicant.status)}`}
                          >
                            {applicant.status}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">Applied: {applicant.appliedDate}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {applicant.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{applicant.resume}</span>
                        </button>
                        <div className="flex space-x-2">
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>Shortlist</span>
                          </button>
                          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1">
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Posting Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Post New Job</h2>
                <button
                  onClick={() => setShowJobForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleJobFormSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Frontend Developer Intern"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={jobForm.department}
                      onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Engineering"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Bangalore, Remote"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select
                      value={jobForm.type}
                      onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="internship">Internship</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stipend/Salary</label>
                    <input
                      type="text"
                      value={jobForm.stipend}
                      onChange={(e) => setJobForm({ ...jobForm, stipend: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. ₹25,000/month"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={jobForm.duration}
                      onChange={(e) => setJobForm({ ...jobForm, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. 3 months, Permanent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the role, responsibilities, and what the candidate will learn..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                  <textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List required skills, technologies, and qualifications..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowJobForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Post Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentModal && selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setShowDocumentModal(false)}
        />
      )}
    </div>
  )
}
    
