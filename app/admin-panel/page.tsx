"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  Briefcase,
  TrendingUp,
  Activity,
  Search,
  Filter,
  LogOut,
  Bell,
  Settings,
  Eye,
  Shield,
  UserCheck,
  UserX,
  BarChart3,
  PieChart,
  User,
  Building2,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userType, setUserType] = useState("all") // "all", "student", "recruiter"
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()

  // Dummy data
  const adminProfile = {
    name: "Admin User",
    email: "admin@zidio.in",
  }

  const stats = {
    totalUsers: 1250,
    totalStudents: 950,
    totalRecruiters: 300,
    totalJobs: 89,
    activeRecruiters: 45,
    pendingApprovals: 12,
  }

  const students = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Student",
      college: "MIT",
      course: "Computer Science",
      year: "3rd Year",
      joinDate: "2024-01-15",
      status: "Active",
      lastLogin: "2024-01-20",
      phone: "+91 9876543210",
      applications: 5,
      profileComplete: 85,
    },
    {
      id: 2,
      name: "Alice Cooper",
      email: "alice@example.com",
      role: "Student",
      college: "Stanford University",
      course: "Data Science",
      year: "2nd Year",
      joinDate: "2024-01-12",
      status: "Active",
      lastLogin: "2024-01-19",
      phone: "+91 9876543211",
      applications: 3,
      profileComplete: 92,
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@example.com",
      role: "Student",
      college: "UC Berkeley",
      course: "Mechanical Engineering",
      year: "4th Year",
      joinDate: "2024-01-08",
      status: "Blocked",
      lastLogin: "2024-01-18",
      phone: "+91 9876543212",
      applications: 8,
      profileComplete: 78,
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah.student@example.com",
      role: "Student",
      college: "Harvard University",
      course: "Business Administration",
      year: "1st Year",
      joinDate: "2024-01-20",
      status: "Pending",
      lastLogin: "2024-01-21",
      phone: "+91 9876543213",
      applications: 1,
      profileComplete: 45,
    },
  ]

  const recruiters = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@techcorp.com",
      role: "Recruiter",
      company: "TechCorp Solutions",
      position: "HR Manager",
      joinDate: "2024-01-10",
      status: "Active",
      lastLogin: "2024-01-19",
      phone: "+91 9876543220",
      jobsPosted: 12,
      applicantsHired: 8,
      companySize: "500-1000",
      verified: true,
    },
    {
      id: 2,
      name: "Emily Brown",
      email: "emily@designstudio.com",
      role: "Recruiter",
      company: "Creative Design Studio",
      position: "Talent Acquisition Lead",
      joinDate: "2024-01-08",
      status: "Active",
      lastLogin: "2024-01-20",
      phone: "+91 9876543221",
      jobsPosted: 8,
      applicantsHired: 5,
      companySize: "50-100",
      verified: true,
    },
    {
      id: 3,
      name: "Robert Chen",
      email: "robert@startup.com",
      role: "Recruiter",
      company: "InnovateTech Startup",
      position: "Founder & CEO",
      joinDate: "2024-01-05",
      status: "Pending",
      lastLogin: "2024-01-18",
      phone: "+91 9876543222",
      jobsPosted: 3,
      applicantsHired: 0,
      companySize: "10-50",
      verified: false,
    },
    {
      id: 4,
      name: "Lisa Wang",
      email: "lisa@enterprise.com",
      role: "Recruiter",
      company: "Enterprise Solutions Inc",
      position: "Senior Recruiter",
      joinDate: "2024-01-14",
      status: "Blocked",
      lastLogin: "2024-01-17",
      phone: "+91 9876543223",
      jobsPosted: 15,
      applicantsHired: 12,
      companySize: "1000+",
      verified: true,
    },
  ]

  const recentActivities = [
    {
      id: 1,
      action: "New student registration",
      user: "Alice Cooper",
      timestamp: "2 hours ago",
      type: "user",
    },
    {
      id: 2,
      action: "Job posted",
      user: "TechCorp Solutions",
      timestamp: "4 hours ago",
      type: "job",
    },
    {
      id: 3,
      action: "Recruiter approved",
      user: "Creative Design Studio",
      timestamp: "6 hours ago",
      type: "approval",
    },
    {
      id: 4,
      action: "Application submitted",
      user: "John Doe",
      timestamp: "8 hours ago",
      type: "application",
    },
  ]

  // Filter users based on type and search
  const getFilteredUsers = () => {
    let users = []

    if (userType === "student") {
      users = students
    } else if (userType === "recruiter") {
      users = recruiters
    } else {
      users = [...students, ...recruiters]
    }

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.college && user.college.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesFilter = filterStatus === "all" || user.status.toLowerCase() === filterStatus
      return matchesSearch && matchesFilter
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-100 border-green-200"
      case "pending":
        return "text-yellow-600 bg-yellow-100 border-yellow-200"
      case "blocked":
        return "text-red-600 bg-red-100 border-red-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "student":
        return "text-blue-600 bg-blue-100 border-blue-200"
      case "recruiter":
        return "text-purple-600 bg-purple-100 border-purple-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "blocked":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  // Logout handler
  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('token');
    router.push('/');
  };

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
                <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Welcome back, {adminProfile.name}</p>
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
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 border border-gray-100">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium ${
                    activeTab === "overview"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium ${
                    activeTab === "users"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>User Management</span>
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium ${
                    activeTab === "analytics"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <PieChart className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                        <p className="text-xs text-green-600 mt-1">↗️ +12% from last month</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Students</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
                        <p className="text-xs text-blue-600 mt-1">📚 Active learners</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Recruiters</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRecruiters}</p>
                        <p className="text-xs text-purple-600 mt-1">🏢 Companies hiring</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalJobs}</p>
                        <p className="text-xs text-green-600 mt-1">💼 Opportunities</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <Briefcase className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                    Recent Activities
                  </h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            activity.type === "user"
                              ? "bg-blue-500"
                              : activity.type === "job"
                                ? "bg-green-500"
                                : activity.type === "approval"
                                  ? "bg-purple-500"
                                  : "bg-orange-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">
                            {activity.user} • {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <p className="text-gray-600 mt-1">Manage students and recruiters on the platform</p>
                </div>

                {/* User Type Filter */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* User Type Tabs */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setUserType("all")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          userType === "all" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        <span>All Users</span>
                      </button>
                      <button
                        onClick={() => setUserType("student")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          userType === "student"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Students</span>
                      </button>
                      <button
                        onClick={() => setUserType("recruiter")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          userType === "recruiter"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Recruiters</span>
                      </button>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-1 gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search users..."
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
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Users List */}
                <div className="space-y-4">
                  {getFilteredUsers().map((user) => (
                    <div
                      key={user.id}
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100"
                    >
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.name}</h3>
                              <div className="flex items-center space-x-3 mb-2">
                                <span
                                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getRoleColor(user.role)}`}
                                >
                                  {user.role}
                                </span>
                                <span
                                  className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.status)}`}
                                >
                                  {getStatusIcon(user.status)}
                                  <span className="ml-1">{user.status}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="w-4 h-4 mr-2" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-4 h-4 mr-2" />
                                <span>{user.phone}</span>
                              </div>
                              {user.role === "Student" ? (
                                <>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <GraduationCap className="w-4 h-4 mr-2" />
                                    <span>{user.college}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium">
                                      {user.course} - {user.year}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Building2 className="w-4 h-4 mr-2" />
                                    <span>{user.company}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <User className="w-4 h-4 mr-2" />
                                    <span>{user.position}</span>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>Joined: {user.joinDate}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Activity className="w-4 h-4 mr-2" />
                                <span>Last login: {user.lastLogin}</span>
                              </div>
                              {user.role === "Student" ? (
                                <>
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">Applications: </span>
                                    <span className="text-blue-600">{user.applications}</span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">Profile: </span>
                                    <span className="text-green-600">{user.profileComplete}% complete</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">Jobs posted: </span>
                                    <span className="text-purple-600">{user.jobsPosted}</span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">Hired: </span>
                                    <span className="text-green-600">{user.applicantsHired}</span>
                                  </div>
                                  {user.verified && (
                                    <div className="flex items-center text-sm text-green-600">
                                      <Shield className="w-4 h-4 mr-1" />
                                      <span>Verified Company</span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-medium">View</span>
                          </button>
                          <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200">
                            <UserCheck className="w-4 h-4" />
                            <span className="text-sm font-medium">Approve</span>
                          </button>
                          <button className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200">
                            <UserX className="w-4 h-4" />
                            <span className="text-sm font-medium">Block</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                  <p className="text-gray-600 mt-1">Platform insights and performance metrics</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Placeholder Charts */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">User Growth Chart</p>
                        <p className="text-sm text-gray-500">Chart visualization would go here</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Applications</h3>
                    <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">Applications Chart</p>
                        <p className="text-sm text-gray-500">Chart visualization would go here</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
                    <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">Distribution Chart</p>
                        <p className="text-sm text-gray-500">Chart visualization would go here</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Activity</h3>
                    <div className="h-64 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">Activity Chart</p>
                        <p className="text-sm text-gray-500">Chart visualization would go here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
