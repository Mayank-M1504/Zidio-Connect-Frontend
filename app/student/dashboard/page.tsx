"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Upload,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building,
  LogOut,
  Bell,
  Settings,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Shield,
} from "lucide-react"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("jobs")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const router = useRouter()

  // Certificate input state
  const [certificates, setCertificates] = useState<Array<{ name: string; file: File | null }>>([{ name: "", file: null }])

  const handleCertificateChange = (index: number, value: string) => {
    setCertificates((prev) => {
      const updated = [...prev]
      updated[index].name = value
      return updated
    })
  }

  const handleCertificateFileChange = (index: number, file: File | null) => {
    setCertificates((prev) => {
      const updated = [...prev]
      updated[index].file = file
      return updated
    })
  }

  const addCertificate = () => {
    setCertificates((prev) => [...prev, { name: "", file: null }])
  }

  const removeCertificate = (index: number) => {
    setCertificates((prev) => prev.length === 1 ? prev : prev.filter((_, i) => i !== index))
  }

  const profilePicInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const marksheetInputRef = useRef<HTMLInputElement>(null)
  const identityInputRef = useRef<HTMLInputElement>(null)

  const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [marksheetFile, setMarksheetFile] = useState<File | null>(null)
  const [identityFile, setIdentityFile] = useState<File | null>(null)

  // const filteredJobs = [];

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
                <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-500">
                  Welcome back
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
                  onClick={() => setActiveTab("documents")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "documents" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Documents</span>
                </button>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "jobs" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Jobs</span>
                </button>
                <button
                  onClick={() => setActiveTab("applications")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "applications" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>My Applications</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>

                <form className="space-y-8">
                  {/* Basic Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">College/University</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Academic Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course/Major</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year</option>
                          <option>5th Year</option>
                          <option>Graduated</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GPA/CGPA</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 8.5 or 3.8"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expected Graduation Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Academic Achievements</label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="List your academic achievements, awards, honors, etc."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Professional Information</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {/* studentProfile.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {skill}
                              <button type="button" className="ml-2 text-blue-600 hover:text-blue-800">
                                ×
                              </button>
                            </span>
                          )) */}
                        </div>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add a skill and press Enter"
                        />
                      </div>
                      {/* Resume upload removed from here */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                          <input
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                          <input
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://github.com/yourusername"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website</label>
                        <input
                          type="url"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Personal Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio/About Me</label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tell us about yourself, your interests, and what makes you unique..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {/* studentProfile.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                            >
                              {interest}
                              <button type="button" className="ml-2 text-green-600 hover:text-green-800">
                                ×
                              </button>
                            </span>
                          )) */}
                        </div>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add an interest and press Enter"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Career Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Career Information</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Career Goals</label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe your career aspirations and long-term goals..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Job Roles</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {/* studentProfile.preferredJobRoles.map((role, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                            >
                              {role}
                              <button type="button" className="ml-2 text-purple-600 hover:text-purple-800">
                                ×
                              </button>
                            </span>
                          )) */}
                        </div>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add a preferred job role and press Enter"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {/* studentProfile.preferredLocations.map((location, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                            >
                              {location}
                              <button type="button" className="ml-2 text-orange-600 hover:text-orange-800">
                                ×
                              </button>
                            </span>
                          )) */}
                        </div>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add a preferred location and press Enter"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Work Authorization Status
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option>Citizen</option>
                          <option>Permanent Resident</option>
                          <option>Work Visa</option>
                          <option>Student Visa</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="bg-white rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Documents</h2>

                <div className="space-y-8">
                  {/* Profile Picture Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Profile Picture</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                          {profilePicFile ? (
                            <img
                              src={URL.createObjectURL(profilePicFile)}
                              alt="Profile"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Upload your profile picture</p>
                        <input
                          type="file"
                          accept="image/*"
                          ref={profilePicInputRef}
                          style={{ display: "none" }}
                          onChange={e => setProfilePicFile(e.target.files ? e.target.files[0] : null)}
                        />
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                          onClick={() => profilePicInputRef.current?.click()}
                        >
                          {profilePicFile ? "Change Picture" : "Upload Picture"}
                        </button>
                        {profilePicFile && (
                          <div className="mt-2 text-xs text-gray-600">{profilePicFile.name}</div>
                        )}
                      </div>
                      {/* Uploaded preview/status can go here if needed */}
                    </div>
                  </div>

                  {/* Resume Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Resume</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload your latest resume</p>
                        <p className="text-xs text-gray-500 mb-3">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          ref={resumeInputRef}
                          style={{ display: "none" }}
                          onChange={e => setResumeFile(e.target.files ? e.target.files[0] : null)}
                        />
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                          onClick={() => resumeInputRef.current?.click()}
                        >
                          {resumeFile ? "Update Resume" : "Upload Resume"}
                        </button>
                        {resumeFile && (
                          <div className="mt-2 text-xs text-gray-600">{resumeFile.name}</div>
                        )}
                      </div>
                      {/* Uploaded preview/status can go here if needed */}
                    </div>
                  </div>

                  {/* Marksheet Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Academic Marksheet</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload your latest marksheet</p>
                        <p className="text-xs text-gray-500 mb-3">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          ref={marksheetInputRef}
                          style={{ display: "none" }}
                          onChange={e => setMarksheetFile(e.target.files ? e.target.files[0] : null)}
                        />
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                          onClick={() => marksheetInputRef.current?.click()}
                        >
                          {marksheetFile ? "Update Marksheet" : "Upload Marksheet"}
                        </button>
                        {marksheetFile && (
                          <div className="mt-2 text-xs text-gray-600">{marksheetFile.name}</div>
                        )}
                      </div>
                      {/* Uploaded preview/status can go here if needed */}
                    </div>
                  </div>

                  {/* Identity Proof Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Identity Proof</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload identity proof</p>
                        <p className="text-xs text-gray-500 mb-3">
                          Aadhar Card, Passport, Driving License, etc. (Max 5MB)
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          ref={identityInputRef}
                          style={{ display: "none" }}
                          onChange={e => setIdentityFile(e.target.files ? e.target.files[0] : null)}
                        />
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                          onClick={() => identityInputRef.current?.click()}
                        >
                          {identityFile ? "Update Identity Proof" : "Upload Identity Proof"}
                        </button>
                        {identityFile && (
                          <div className="mt-2 text-xs text-gray-600">{identityFile.name}</div>
                        )}
                      </div>
                      {/* Uploaded preview/status can go here if needed */}
                    </div>
                  </div>

                  {/* Certificates Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Certificates</h3>
                    <div className="space-y-4">
                      {/* Upload New Certificate */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white shadow-sm">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Enter certificate name/number and upload the file for each certificate</p>
                        <p className="text-xs text-gray-500 mb-3">
                          Course certificates, internship certificates, awards, etc.
                        </p>
                        <div className="space-y-6">
                          {certificates.map((cert, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row md:items-end gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm relative">
                              <div className="flex-1 flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 mb-1">Certificate Name/Number</label>
                                <input
                                  type="text"
                                  value={cert.name}
                                  onChange={e => handleCertificateChange(idx, e.target.value)}
                                  placeholder={`Certificate name/number #${idx + 1}`}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                                />
                              </div>
                              <div className="flex-1 flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 mb-1">Upload File</label>
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={e => handleCertificateFileChange(idx, e.target.files ? e.target.files[0] : null)}
                                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {cert.file && (
                                  <span className="text-xs text-gray-600 truncate max-w-xs mt-1">{cert.file.name}</span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeCertificate(idx)}
                                className="absolute top-2 right-2 text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-100 bg-red-50 text-xs font-medium shadow-sm disabled:opacity-50"
                                disabled={certificates.length === 1}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addCertificate}
                          className="mt-6 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          Add Another Certificate
                        </button>
                      </div>

                      {/* Existing Certificates (commented out) */}
                      {/* <div className="space-y-3"> ... </div> */}
                    </div>
                  </div>

                  {/* Document Status Summary */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-900 mb-3">Document Verification Status</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Profile Picture</span>
                          <span className="text-sm font-medium text-green-600">✓ Complete</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Resume</span>
                          <span className="text-sm font-medium text-green-600">✓ Complete</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Marksheet</span>
                          <span className="text-sm font-medium text-green-600">✓ Complete</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Identity Proof</span>
                          <span className="text-sm font-medium text-yellow-600">⚠ Pending</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Certificates</span>
                          <span className="text-sm font-medium text-green-600">✓ 2 Uploaded</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Overall Status</span>
                          <span className="text-sm font-medium text-blue-600">80% Complete</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === "jobs" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search jobs or companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Types</option>
                        <option value="internship">Internships</option>
                        <option value="full-time">Full-time</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Job Listings */}
                <div className="space-y-4">
                  {/* filteredJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Building className="w-4 h-4" />
                              <span>{job.company}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{job.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-green-600 font-semibold">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.stipend}</span>
                          </div>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              job.type === "Internship" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {job.type}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.map((req, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                            {req}
                  </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Posted {job.posted}</span>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  )) */}
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div className="bg-white rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h2>

                <div className="space-y-4">
                  {/* applications.map((app) => (
                    <div
                      key={app.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{app.jobTitle}</h3>
                          <p className="text-gray-600 mb-2">{app.company}</p>
                          <p className="text-sm text-gray-500">Applied on {app.appliedDate}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(app.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${app.statusColor}`}>
                            {app.status}
                  </span>
                        </div>
                      </div>
                    </div>
                  )) */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
