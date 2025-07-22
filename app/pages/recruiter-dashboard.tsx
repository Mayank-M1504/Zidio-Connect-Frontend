"use client"

import type React from "react"
import { useState, useEffect } from "react"
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

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState("jobs")
  const [showJobForm, setShowJobForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  // State for jobs data
  const [postedJobs, setPostedJobs] = useState([
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
  ])

  const [recruiterProfile, setRecruiterProfile] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@techcorp.com",
    phone: "+91 9876543210",
    companyName: "TechCorp Solutions",
    companyWebsite: "https://techcorp.com",
    companyAddress: "Tech Park, Whitefield, Bangalore, Karnataka 560066, India",
    companyDescription:
      "TechCorp Solutions is a leading software development company specializing in web and mobile applications.",
    recruiterRole: "HR Manager",
    linkedinProfile: "https://linkedin.com/in/sarahjohnson",
    stinNumber: "STIN123456789",
    documents: {
      companyRegistration: {
        name: "techcorp_incorporation_certificate.pdf",
        uploadDate: "2024-01-10",
        size: "2.1 MB",
        status: "uploaded",
        type: "Certificate of Incorporation",
      },
      gstCertificate: {
        name: "techcorp_gst_certificate.pdf",
        uploadDate: "2024-01-12",
        size: "1.5 MB",
        status: "uploaded",
      },
      panCard: {
        name: "techcorp_pan_card.pdf",
        uploadDate: "2024-01-08",
        size: "0.8 MB",
        status: "uploaded",
      },
      businessLicense: {
        name: null,
        uploadDate: null,
        size: null,
        status: "pending",
      },
    },
  })

  const [applicants, setApplicants] = useState([
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
  ])

  // Load data from backend
  useEffect(() => {
    // TODO: Load recruiter profile, posted jobs, and applicants from backend
    // This will be implemented when the backend endpoints are ready
  }, [])

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

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Recruiter Dashboard</h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {recruiterProfile.firstName} {recruiterProfile.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs Posted</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{postedJobs.length}</p>
                <p className="text-xs text-green-600 mt-1">↗️ +2 this week</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{applicants.length}</p>
                <p className="text-xs text-green-600 mt-1">↗️ +12 this week</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {applicants.filter((app) => app.status === "Shortlisted").length}
                </p>
                <p className="text-xs text-purple-600 mt-1">📋 Ready for interview</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {
                    postedJobs.filter((job) => {
                      const jobDate = new Date(job.posted)
                      const now = new Date()
                      return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear()
                    }).length
                  }
                </p>
                <p className="text-xs text-orange-600 mt-1">📅 Active postings</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 border border-gray-100">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium ${
                    activeTab === "profile"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium ${
                    activeTab === "jobs"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>My Jobs</span>
                </button>
                <button
                  onClick={() => setActiveTab("applicants")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium ${
                    activeTab === "applicants"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={recruiterProfile.firstName}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={recruiterProfile.lastName}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter last name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={recruiterProfile.email}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={recruiterProfile.phone}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recruiter Role</label>
                      <select
                        value={recruiterProfile.recruiterRole}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                        value={recruiterProfile.linkedinProfile}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                    Company Information
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company/Organization Name
                        </label>
                        <input
                          type="text"
                          value={recruiterProfile.companyName}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                        <input
                          type="url"
                          value={recruiterProfile.companyWebsite}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="https://yourcompany.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                      <textarea
                        value={recruiterProfile.companyAddress}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Complete office address including city, state, country, and ZIP"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                      <textarea
                        value={recruiterProfile.companyDescription}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Describe your company, culture, services, or products..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">STIN / Registration Number</label>
                      <input
                        type="text"
                        value={recruiterProfile.stinNumber}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter STIN or company registration number"
                      />
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                    Company Documents
                  </h3>
                  <div className="space-y-8">
                    {/* Company Registration Certificate */}
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-4">Company Registration Certificate</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
                          <Building className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm font-medium text-gray-600 mb-2">Upload Registration Certificate</p>
                          <p className="text-xs text-gray-500 mb-4">
                            Certificate of Incorporation, MSME, Shop & Establishment License
                          </p>
                          <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                          >
                            {recruiterProfile.documents.companyRegistration.status === "uploaded"
                              ? "Update Certificate"
                              : "Upload Certificate"}
                          </button>
                        </div>
                        {recruiterProfile.documents.companyRegistration.status === "uploaded" && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-green-800 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {recruiterProfile.documents.companyRegistration.type}
                              </span>
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
                                <button className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {recruiterProfile.documents.companyRegistration.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {recruiterProfile.documents.companyRegistration.size} •{" "}
                              {recruiterProfile.documents.companyRegistration.uploadDate}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* GST Registration Certificate */}
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-4">GST Registration Certificate</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
                          <Shield className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm font-medium text-gray-600 mb-2">Upload GST Certificate</p>
                          <p className="text-xs text-gray-500 mb-4">Required for tax verification and invoicing</p>
                          <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                          >
                            {recruiterProfile.documents.gstCertificate.status === "uploaded"
                              ? "Update GST Certificate"
                              : "Upload GST Certificate"}
                          </button>
                        </div>
                        {recruiterProfile.documents.gstCertificate.status === "uploaded" && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-green-800 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                GST Certificate
                              </span>
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
                                <button className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {recruiterProfile.documents.gstCertificate.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {recruiterProfile.documents.gstCertificate.size} •{" "}
                              {recruiterProfile.documents.gstCertificate.uploadDate}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* PAN Card */}
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-4">PAN Card (Company or Individual)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
                          <User className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm font-medium text-gray-600 mb-2">Upload PAN Card</p>
                          <p className="text-xs text-gray-500 mb-4">Company PAN or Individual PAN for verification</p>
                          <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                          >
                            {recruiterProfile.documents.panCard.status === "uploaded"
                              ? "Update PAN Card"
                              : "Upload PAN Card"}
                          </button>
                        </div>
                        {recruiterProfile.documents.panCard.status === "uploaded" && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-green-800 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                PAN Card
                              </span>
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
                                <button className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{recruiterProfile.documents.panCard.name}</p>
                            <p className="text-xs text-gray-500">
                              {recruiterProfile.documents.panCard.size} •{" "}
                              {recruiterProfile.documents.panCard.uploadDate}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Business License */}
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-4">Business License or Trade License</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
                          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm font-medium text-gray-600 mb-2">Upload Business License</p>
                          <p className="text-xs text-gray-500 mb-4">
                            Required for regulated sectors (healthcare, finance, etc.)
                          </p>
                          <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                          >
                            Upload Business License
                          </button>
                        </div>
                        {recruiterProfile.documents.businessLicense.status === "pending" && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                              <span className="text-sm font-medium text-yellow-800">Optional Document</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Business license may be required for certain industries
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Verification Status */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">Document Verification Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Company Registration</span>
                        <span className="text-sm font-medium text-green-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">GST Certificate</span>
                        <span className="text-sm font-medium text-green-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">PAN Card</span>
                        <span className="text-sm font-medium text-green-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Business License</span>
                        <span className="text-sm font-medium text-gray-500">- Optional</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Verification Status</span>
                      <span className="text-sm font-medium text-green-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified Company
                      </span>
                    </div>
                    <div className="bg-green-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === "jobs" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                {/* Header with Post Job Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Posted Jobs</h2>
                    <p className="text-gray-600 mt-1">Manage your job postings and track applications</p>
                  </div>
                  <button
                    onClick={() => setShowJobForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post New Job</span>
                  </button>
                </div>

                {/* Job Listings */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Job Title
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Applicants
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {postedJobs.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{job.title}</div>
                                <div className="text-sm text-gray-500">{job.type}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {job.department}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {job.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-blue-600">{job.applicants}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                  job.status === "Active"
                                    ? "bg-green-100 text-green-800 border border-green-200"
                                    : "bg-red-100 text-red-800 border border-red-200"
                                }`}
                              >
                                {job.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-3">
                                <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-1 rounded">
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
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
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Job Applicants</h2>
                  <p className="text-gray-600 mt-1">Review and manage candidate applications</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search applicants by name or job title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-[150px]"
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
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100"
                    >
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{applicant.name}</h3>
                          <div className="space-y-1">
                            <p className="text-gray-600 flex items-center">
                              <span className="font-medium">Email:</span>
                              <span className="ml-2">{applicant.email}</span>
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <span className="font-medium">College:</span>
                              <span className="ml-2">{applicant.college}</span>
                            </p>
                            <p className="text-blue-600 font-medium">{applicant.jobTitle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(applicant.status)}`}
                          >
                            {applicant.status}
                          </span>
                          <p className="text-sm text-gray-500 mt-2">Applied: {applicant.appliedDate}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {applicant.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2 transition-colors duration-200">
                          <Download className="w-4 h-4" />
                          <span>{applicant.resume}</span>
                        </button>
                        <div className="flex space-x-3">
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 font-medium">
                            <CheckCircle className="w-4 h-4" />
                            <span>Shortlist</span>
                          </button>
                          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 font-medium">
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
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleJobFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g. Frontend Developer Intern"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      value={jobForm.department}
                      onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g. Engineering"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g. Bangalore, Remote"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <select
                      value={jobForm.type}
                      onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="internship">Internship</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stipend/Salary</label>
                    <input
                      type="text"
                      value={jobForm.stipend}
                      onChange={(e) => setJobForm({ ...jobForm, stipend: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g. ₹25,000/month"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      value={jobForm.duration}
                      onChange={(e) => setJobForm({ ...jobForm, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g. 3 months, Permanent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Describe the role, responsibilities, and what the candidate will learn..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                  <textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="List required skills, technologies, and qualifications..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowJobForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                  >
                    Post Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
