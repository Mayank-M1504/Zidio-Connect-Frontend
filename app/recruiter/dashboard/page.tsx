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
  MessageCircle,
} from "lucide-react"
import { getCurrentRecruiterProfile, RecruiterProfileData, updateRecruiterProfile, getRecruiterDocuments, deleteRecruiterDocument, getRecruiterJobs, Job, postRecruiterJob, deleteRecruiterJob, uploadRecruiterCompanyLogo, getApplicationsForJob, updateApplicationStatus } from "@/lib/api";
import DocumentViewer from "../../../components/DocumentViewer"
import MessageModal from "../../../components/MessageModal";

interface LocalJob {
  id: number
  title: string
  department: string
  location: string
  type: string
  stipend: string
  applicants: number
  posted: string
  status: string
}

interface Applicant {
  id: number
  name: string
  email: string
  college: string
  jobTitle: string
  appliedDate: string
  status: string
  resume: string
  skills: string[]
}

export default function RecruiterDashboard() {
  // State for jobs and applicants data
  const [postedJobs, setPostedJobs] = useState<LocalJob[]>([])
  const [applicants, setApplicants] = useState<any[]>([])
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
    // Fetch recruiter jobs
    getRecruiterJobs().then((jobs) => setPostedJobs(jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.jobType || '',
      stipend: job.stipendSalary || '',
      applicants: job.applicants || 0,
      posted: job.posted || '',
      status: job.adminApprovalStatus || '',
    }))));
    // Fetch recruiter documents
    getRecruiterDocuments()
      .then((docs) => setRecruiterDocuments(docs))
      .finally(() => setDocLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === "applicants" && postedJobs.length > 0) {
      // Fetch applications for all jobs
      Promise.all(postedJobs.map(job => getApplicationsForJob(job.id)))
        .then((allApps) => {
          // Store the full application objects from the API
          setApplicants(allApps.flat());
        })
        .catch(() => setApplicants([]));
    }
  }, [activeTab, postedJobs]);

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

  const [jobForm, setJobForm] = useState({
    title: "",
    department: "",
    location: "",
    type: "internship",
    stipend: "",
    duration: "",
    description: "",
    requirements: "",
    questionForApplicant: "",
  })

  const handleJobFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postRecruiterJob({
        title: jobForm.title,
        department: jobForm.department,
        location: jobForm.location,
        jobType: jobForm.type,
        stipendSalary: jobForm.stipend,
        duration: jobForm.duration,
        description: jobForm.description,
        requirements: jobForm.requirements,
        questionForApplicant: jobForm.questionForApplicant,
      });
      // Optionally refetch jobs here:
      getRecruiterJobs().then((jobs) => setPostedJobs(jobs.map((job: any) => ({
        id: job.id,
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.jobType || '',
        stipend: job.stipendSalary || '',
        applicants: job.applicants || 0,
        posted: job.posted || '',
        status: job.adminApprovalStatus || '',
      }))));
      setShowJobForm(false);
      setJobForm({
        title: "",
        department: "",
        location: "",
        type: "internship",
        stipend: "",
        duration: "",
        description: "",
        requirements: "",
        questionForApplicant: "",
      });
    } catch (err) {
      alert("Failed to post job. Please try again.");
    }
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);
  const [deleteInput, setDeleteInput] = useState("");

  const handleDeleteJob = async (jobId: number) => {
    try {
      await deleteRecruiterJob(jobId);
      getRecruiterJobs().then((jobs) => setPostedJobs(jobs.map((job: any) => ({
        id: job.id,
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.jobType || '',
        stipend: job.stipendSalary || '',
        applicants: job.applicants || 0,
        posted: job.posted || '',
        status: job.adminApprovalStatus || '',
      }))));
    } catch (err) {
      alert("Failed to delete job. Please try again.");
    }
  };

  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyLogoUploading, setCompanyLogoUploading] = useState(false);
  const [companyLogoUploadMsg, setCompanyLogoUploadMsg] = useState<string | null>(null);
  const companyLogoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profileForm && profileForm.companyLogo) {
      setCompanyLogo(profileForm.companyLogo);
    }
  }, [profileForm]);

  const handleCompanyLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompanyLogoUploading(true);
    setCompanyLogoUploadMsg(null);
    try {
      const url = await uploadRecruiterCompanyLogo(file);
      setCompanyLogo(url);
      setCompanyLogoUploadMsg('Logo uploaded successfully!');
      setProfileForm((prev) => ({ ...prev, companyLogo: url }));
    } catch (err: any) {
      setCompanyLogoUploadMsg('Failed to upload logo');
    } finally {
      setCompanyLogoUploading(false);
      setTimeout(() => setCompanyLogoUploadMsg(null), 3000);
    }
  };

  function isProfileComplete(profile: any) {
    return profile.firstName && profile.lastName && profile.email && profile.phone && profile.companyName;
  }
  function areDocsApproved(docs: any[]) {
    const required = ["registration", "gst", "pan", "business"];
    return required.every(type => docs.some(doc => doc.type === type && doc.status === "APPROVED"));
  }

  const canPostJob = isProfileComplete(profileForm) && areDocsApproved(recruiterDocuments);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const handleStatusUpdate = async (status: string) => {
    if (!selectedApplicant) return;
    setStatusUpdating(true);
    try {
      await updateApplicationStatus(selectedApplicant.id, status);
      if (status === "REJECTED") {
        setApplicants((prev) => prev.filter(app => app.id !== selectedApplicant.id));
      } else {
        setApplicants((prev) => prev.map(app => app.id === selectedApplicant.id ? { ...app, status } : app));
      }
      setSelectedApplicant(null);
    } catch (err) {
      alert("Failed to update status. Please try again.");
    } finally {
      setStatusUpdating(false);
    }
  };

  // Helper function to infer content type from URL
  function inferContentTypeFromUrl(url: string) {
    if (!url) return '';
    if (url.endsWith('.pdf')) return 'application/pdf';
    if (url.match(/\.(jpg|jpeg|png|gif)$/i)) return 'image/';
    return '';
  }

  const [showChatModal, setShowChatModal] = useState(false);
  const [chatApplicationId, setChatApplicationId] = useState<number | null>(null);

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
                onClick={handleLogout}
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
                <p className="text-2xl font-bold text-gray-900">{postedJobs.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applicants</p>
                <p className="text-2xl font-bold text-gray-900">{applicants.length}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applicants.filter(app => app.status === 'Shortlisted').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {postedJobs.filter(job => {
                    const jobDate = new Date(job.posted)
                    const now = new Date()
                    return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
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
                  {/* Company Logo */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center mb-8">
                    <Building className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload Company Logo</p>
                    <p className="text-xs text-gray-500 mb-3">Recommended: Square PNG/JPG, max 2MB</p>
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div className="flex items-center gap-4">
                        {companyLogo ? (
                          <img src={companyLogo} alt="Company Logo" className="w-20 h-20 object-contain rounded border" />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded border text-gray-400">No Logo</div>
                        )}
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            ref={companyLogoInputRef}
                            style={{ display: 'none' }}
                            onChange={handleCompanyLogoChange}
                          />
                          <button
                            type="button"
                            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 font-medium"
                            onClick={() => companyLogoInputRef.current?.click()}
                            disabled={companyLogoUploading}
                          >
                            {companyLogoUploading ? 'Uploading...' : 'Choose File'}
                          </button>
                        </div>
                      </div>
                      {companyLogoUploadMsg && (
                        <span className={companyLogoUploadMsg.includes('success') ? 'text-green-600' : 'text-red-600'}>{companyLogoUploadMsg}</span>
                      )}
                    </div>
                  </div>
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
                  <div className="relative group" style={{ display: 'inline-block' }}
                    onMouseEnter={() => { if (!canPostJob) setShowTooltip(true); }}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <button
                      onClick={() => canPostJob && setShowJobForm(true)}
                      className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${canPostJob ? 'hover:shadow-lg transform hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
                      disabled={!canPostJob}
                      tabIndex={0}
                      style={{ pointerEvents: canPostJob ? 'auto' : 'none' }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Post New Job</span>
                    </button>
                    {showTooltip && !canPostJob && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-20 flex flex-col items-center" style={{ minWidth: 240 }}>
                        <div className="relative bg-blue-100 text-blue-900 text-sm rounded-xl px-4 py-2 shadow-lg border border-blue-400 font-medium animate-fade-in" style={{ boxShadow: '0 4px 16px rgba(30,64,175,0.10)' }}>
                          Please complete your profile and upload all required documents to post a job.
                          <span className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-100"></span>
                        </div>
                      </div>
                    )}
                  </div>
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  job.adminApprovalStatus === "APPROVED"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {job.adminApprovalStatus === "APPROVED" ? "Approved" : "Pending"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => {
                                  setJobToDelete(job.id);
                                  setShowDeleteDialog(true);
                                  setDeleteInput("");
                                }}
                                title="Delete Job"
                              >
                                <XCircle className="w-4 h-4" />
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
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedApplicant(applicant)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{applicant.studentName}</h3>
                          <p className="text-gray-600 mb-1">{applicant.studentEmail}</p>
                          <p className="text-sm text-gray-500 mb-2">{applicant.college}</p>
                          <p className="text-sm font-medium text-blue-600">{applicant.jobTitle}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(applicant.status)}`}
                          >
                            {applicant.status}
                          </span>
                          {applicant.status.toLowerCase() === "shortlisted" && (
                            <button
                              className="ml-2 text-blue-600 hover:text-blue-800"
                              title="Open Chat"
                              onClick={e => {
                                e.stopPropagation();
                                setChatApplicationId(applicant.id);
                                setShowChatModal(true);
                              }}
                            >
                              <MessageCircle className="w-5 h-5" />
                            </button>
                          )}
                          <p className="text-sm text-gray-500 mt-1">Applied: {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {Array.isArray(applicant.skills) && applicant.skills.length > 0 ? (
                          applicant.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">No skills listed</span>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{applicant.resume?.name || 'No Resume'}</span>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question for Applicants (optional)</label>
                  <textarea
                    value={jobForm.questionForApplicant}
                    onChange={(e) => setJobForm({ ...jobForm, questionForApplicant: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Why do you want to join our company?"
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

      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
            <p className="mb-4">Type <span className="font-bold">Yes</span> to confirm deletion of this job.</p>
            <input
              type="text"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Type Yes to confirm"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white"
                disabled={deleteInput !== "Yes"}
                onClick={async () => {
                  if (jobToDelete && deleteInput === "Yes") {
                    await handleDeleteJob(jobToDelete);
                    setShowDeleteDialog(false);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentModal && selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onStatusChange={async (_docId, newStatus) => {
            if (!selectedApplicant) return;
            setStatusUpdating(true);
            try {
              await updateApplicationStatus(selectedApplicant.id, newStatus);
              setApplicants((prev) => prev.map(app => app.id === selectedApplicant.id ? { ...app, status: newStatus } : app));
              setShowDocumentModal(false);
              setSelectedDocument(null);
              setSelectedApplicant(null);
            } catch (err) {
              alert("Failed to update status. Please try again.");
            } finally {
              setStatusUpdating(false);
            }
          }}
          onClose={() => { setShowDocumentModal(false); setSelectedDocument(null); }}
        />
      )}

      {selectedApplicant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedApplicant(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6">Application Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Section */}
              <div>
                <h3 className="text-lg font-semibold mb-2 border-l-4 border-blue-500 pl-2">Profile</h3>
                <div className="mb-2">
                  <label className="block text-xs text-gray-500">Name</label>
                  <div className="bg-gray-100 rounded px-3 py-2">{selectedApplicant.studentName || '-'}</div>
                </div>
                <div className="mb-2">
                  <label className="block text-xs text-gray-500">Email</label>
                  <div className="bg-gray-100 rounded px-3 py-2">{selectedApplicant.studentEmail || '-'}</div>
                </div>
                {selectedApplicant.phone && (
                  <div className="mb-2">
                    <label className="block text-xs text-gray-500">Phone</label>
                    <div className="bg-gray-100 rounded px-3 py-2">{selectedApplicant.phone}</div>
                  </div>
                )}
                {selectedApplicant.college && (
                  <div className="mb-2">
                    <label className="block text-xs text-gray-500">College</label>
                    <div className="bg-gray-100 rounded px-3 py-2">{selectedApplicant.college}</div>
                  </div>
                )}
                {selectedApplicant.course && (
                  <div className="mb-2">
                    <label className="block text-xs text-gray-500">Course</label>
                    <div className="bg-gray-100 rounded px-3 py-2">{selectedApplicant.course}</div>
                  </div>
                )}
                {selectedApplicant.yearOfStudy && (
                  <div className="mb-2">
                    <label className="block text-xs text-gray-500">Year</label>
                    <div className="bg-gray-100 rounded px-3 py-2">{selectedApplicant.yearOfStudy}</div>
                  </div>
                )}
              </div>
              {/* Documents Section */}
              <div>
                <h3 className="text-lg font-semibold mb-2 border-l-4 border-blue-500 pl-2">Documents</h3>
                <div className="mb-2">
                  <label className="block text-xs text-gray-500">Resume</label>
                  <div className="bg-gray-100 rounded px-3 py-2 flex items-center gap-2">
                    {selectedApplicant.resume?.url ? (
                      <>
                        <span>{selectedApplicant.resume.name || 'Resume'}</span>
                        <button type="button" title="View Resume" onClick={() => {
                          const doc = selectedApplicant.resume;
                          setSelectedDocument({
                            ...doc,
                            fileName: doc.name || 'Resume',
                            contentType: doc.contentType || inferContentTypeFromUrl(doc.url),
                          });
                          setShowDocumentModal(true);
                        }}>
                          <Eye className="w-4 h-4 text-blue-600 inline-block align-middle hover:text-blue-800" />
                        </button>
                      </>
                    ) : (
                      'Not submitted'
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-xs text-gray-500">Marksheet</label>
                  <div className="bg-gray-100 rounded px-3 py-2 flex items-center gap-2">
                    {selectedApplicant.marksheet?.url ? (
                      <>
                        <span>{selectedApplicant.marksheet.name || 'Marksheet'}</span>
                        <button type="button" title="View Marksheet" onClick={() => {
                          const doc = selectedApplicant.marksheet;
                          setSelectedDocument({
                            ...doc,
                            fileName: doc.name || 'Marksheet',
                            contentType: doc.contentType || inferContentTypeFromUrl(doc.url),
                          });
                          setShowDocumentModal(true);
                        }}>
                          <Eye className="w-4 h-4 text-blue-600 inline-block align-middle hover:text-blue-800" />
                        </button>
                      </>
                    ) : (
                      'Not submitted'
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-xs text-gray-500">Certificates</label>
                  <div className="bg-gray-100 rounded px-3 py-2">
                    {Array.isArray(selectedApplicant.certificates) && selectedApplicant.certificates.length > 0 ? (
                      <ul className="list-disc ml-6">
                        {selectedApplicant.certificates.map((cert: any, idx: number) => (
                          <li key={cert.id} className="flex items-center gap-2">
                            <span>{cert.name || 'Certificate'}</span>
                            <button type="button" title="View Certificate" onClick={() => {
                              setSelectedDocument({
                                ...cert,
                                fileName: cert.name || 'Certificate',
                                contentType: cert.contentType || inferContentTypeFromUrl(cert.url),
                              });
                              setShowDocumentModal(true);
                            }}>
                              <Eye className="w-4 h-4 text-blue-600 inline-block align-middle hover:text-blue-800" />
                            </button>
                            {cert.status && <span className="ml-2 text-xs text-gray-500">({cert.status})</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'None'
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                className="px-6 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:opacity-50"
                disabled={statusUpdating}
                onClick={() => handleStatusUpdate("REJECTED")}
              >
                {statusUpdating ? "Updating..." : "Reject"}
              </button>
              <button
                className="px-6 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 transition disabled:opacity-50"
                disabled={statusUpdating}
                onClick={() => handleStatusUpdate("SHORTLISTED")}
              >
                {statusUpdating ? "Updating..." : "Shortlist"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showChatModal && chatApplicationId && (
        <MessageModal
          applicationId={chatApplicationId}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  )
}
    
