"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
} from "lucide-react"

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState("jobs")
  const [showJobForm, setShowJobForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  // State for jobs data
  const [postedJobs, setPostedJobs] = useState([])
  const [recruiterProfile, setRecruiterProfile] = useState({
    name: "",
    company: "",
    email: "",
  })
  const [applicants, setApplicants] = useState([])

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
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/';
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
                <p className="text-sm text-gray-500">Welcome back, {recruiterProfile.name}</p>
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
    </div>
  )
}
