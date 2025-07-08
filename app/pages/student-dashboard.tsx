"use client"

import { useState } from "react"
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
} from "lucide-react"
import { useRef } from "react"

export default function StudentDashboard() {
  console.log("StudentDashboard component loaded");
  const [activeTab, setActiveTab] = useState("jobs")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const router = useRouter()
  const [profilePicture, setProfilePicture] = useState(studentProfile.profilePicture)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/';
  }

  // Minimal robust upload handler
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      console.log('No file selected')
      return
    }
    setUploading(true)
    console.log('Uploading file:', file)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch("/api/profile/upload-photo", {
        method: "POST",
        body: formData,
        credentials: "include",
      })
      const data = await res.json()
      console.log('Upload response:', data)
      if (data.profilePictureUrl) {
        setProfilePicture(data.profilePictureUrl)
      }
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  // Dummy data
  const studentProfile = {
    // Basic Information
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    profilePicture: null,
    college: "MIT",

    // Academic Information
    course: "Computer Science",
    yearOfStudy: "3rd Year",
    gpa: "8.5",
    expectedGraduation: "2025-05-15",
    academicAchievements: "Dean's List 2023, Best Project Award",

    // Professional Information
    skills: ["Java", "Python", "JavaScript", "React", "Node.js", "MongoDB"],
    resume: "john_doe_resume.pdf",
    linkedinProfile: "https://linkedin.com/in/johndoe",
    githubProfile: "https://github.com/johndoe",
    portfolioWebsite: "https://johndoe.dev",

    // Personal Information
    dateOfBirth: "2002-03-15",
    address: "123 Main Street, Boston, MA 02101",
    bio: "Passionate computer science student with a keen interest in full-stack development and machine learning. Always eager to learn new technologies and work on challenging projects.",
    interests: ["Web Development", "Machine Learning", "Open Source", "Gaming"],

    // Career Information
    careerGoals: "To become a full-stack developer at a leading tech company and eventually start my own startup",
    preferredJobRoles: ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
    preferredLocations: ["Bangalore", "Mumbai", "Remote"],
    workAuthorizationStatus: "Student Visa",
  }

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "TechCorp",
      location: "Bangalore",
      type: "Internship",
      duration: "3 months",
      stipend: "₹25,000/month",
      description: "Work on React.js projects and learn modern web development.",
      requirements: ["React.js", "JavaScript", "HTML/CSS"],
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "DataFlow",
      location: "Mumbai",
      type: "Internship",
      duration: "6 months",
      stipend: "₹30,000/month",
      description: "Analyze data and build machine learning models.",
      requirements: ["Python", "Machine Learning", "SQL"],
      posted: "1 week ago",
    },
    {
      id: 3,
      title: "Software Engineer",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      duration: "Permanent",
      stipend: "₹8,00,000/year",
      description: "Full-stack development role with growth opportunities.",
      requirements: ["Node.js", "React", "MongoDB"],
      posted: "3 days ago",
    },
  ]

  const applications = [
    {
      id: 1,
      jobTitle: "Frontend Developer Intern",
      company: "TechCorp",
      appliedDate: "2024-01-15",
      status: "Under Review",
      statusColor: "text-yellow-600 bg-yellow-100",
    },
    {
      id: 2,
      jobTitle: "Backend Developer",
      company: "WebSolutions",
      appliedDate: "2024-01-10",
      status: "Accepted",
      statusColor: "text-green-600 bg-green-100",
    },
    {
      id: 3,
      jobTitle: "UI/UX Designer",
      company: "DesignStudio",
      appliedDate: "2024-01-08",
      status: "Rejected",
      statusColor: "text-red-600 bg-red-100",
    },
    {
      id: 4,
      jobTitle: "Data Analyst",
      company: "Analytics Pro",
      appliedDate: "2024-01-20",
      status: "Applied",
      statusColor: "text-blue-600 bg-blue-100",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "Under Review":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-blue-600" />
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || job.type.toLowerCase() === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <span className="text-white font-bold text-xl">Z</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleProfilePicChange}
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {studentProfile.firstName} {studentProfile.lastName}
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
                          value={studentProfile.firstName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={studentProfile.lastName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={studentProfile.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={studentProfile.phone}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                            {profilePicture ? (
                              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <img src="/placeholder-user.jpg" alt="Default" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            onChange={handleProfilePicChange}
                          />
                          <button type="button" className="text-blue-600 hover:text-blue-700 font-medium" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                            {uploading ? "Uploading..." : "Change Photo"}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">College/University</label>
                        <input
                          type="text"
                          value={studentProfile.college}
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
                          value={studentProfile.course}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
                        <select
                          value={studentProfile.yearOfStudy}
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
                          value={studentProfile.gpa}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 8.5 or 3.8"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expected Graduation Date</label>
                        <input
                          type="date"
                          value={studentProfile.expectedGraduation}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Academic Achievements</label>
                        <textarea
                          value={studentProfile.academicAchievements}
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
                          {studentProfile.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {skill}
                              <button type="button" className="ml-2 text-blue-600 hover:text-blue-800">
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add a skill and press Enter"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            Current: <span className="font-medium">{studentProfile.resume}</span>
                          </p>
                          <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                            Upload New Resume
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                          <input
                            type="url"
                            value={studentProfile.linkedinProfile}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                          <input
                            type="url"
                            value={studentProfile.githubProfile}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://github.com/yourusername"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website</label>
                        <input
                          type="url"
                          value={studentProfile.portfolioWebsite}
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
                          value={studentProfile.dateOfBirth}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          type="text"
                          value={studentProfile.address}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio/About Me</label>
                        <textarea
                          value={studentProfile.bio}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tell us about yourself, your interests, and what makes you unique..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {studentProfile.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                            >
                              {interest}
                              <button type="button" className="ml-2 text-green-600 hover:text-green-800">
                                ×
                              </button>
                            </span>
                          ))}
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
                          value={studentProfile.careerGoals}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe your career aspirations and long-term goals..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Job Roles</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {studentProfile.preferredJobRoles.map((role, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                            >
                              {role}
                              <button type="button" className="ml-2 text-purple-600 hover:text-purple-800">
                                ×
                              </button>
                            </span>
                          ))}
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
                          {studentProfile.preferredLocations.map((location, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                            >
                              {location}
                              <button type="button" className="ml-2 text-orange-600 hover:text-orange-800">
                                ×
                              </button>
                            </span>
                          ))}
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
                          value={studentProfile.workAuthorizationStatus}
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
                  {filteredJobs.map((job) => (
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
                  ))}
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div className="bg-white rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h2>

                <div className="space-y-4">
                  {applications.map((app) => (
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
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
