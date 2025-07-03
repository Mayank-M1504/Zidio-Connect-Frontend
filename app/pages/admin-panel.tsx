"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
} from "lucide-react"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const navigate = useNavigate()

  // Dummy data
  const adminProfile = {
    name: "Admin User",
    email: "admin@zidio.in",
  }

  const stats = {
    totalUsers: 1250,
    totalJobs: 89,
    activeRecruiters: 45,
    pendingApprovals: 12,
  }

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Student",
      college: "MIT",
      joinDate: "2024-01-15",
      status: "Active",
      lastLogin: "2024-01-20",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@techcorp.com",
      role: "Recruiter",
      company: "TechCorp",
      joinDate: "2024-01-10",
      status: "Pending",
      lastLogin: "2024-01-19",
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@example.com",
      role: "Student",
      college: "Stanford",
      joinDate: "2024-01-12",
      status: "Blocked",
      lastLogin: "2024-01-18",
    },
    {
      id: 4,
      name: "Emily Brown",
      email: "emily@designstudio.com",
      role: "Recruiter",
      company: "Design Studio",
      joinDate: "2024-01-08",
      status: "Active",
      lastLogin: "2024-01-20",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      action: "New user registration",
      user: "Alice Cooper",
      timestamp: "2 hours ago",
      type: "user",
    },
    {
      id: 2,
      action: "Job posted",
      user: "TechCorp",
      timestamp: "4 hours ago",
      type: "job",
    },
    {
      id: 3,
      action: "User approved",
      user: "Bob Smith",
      timestamp: "6 hours ago",
      type: "approval",
    },
    {
      id: 4,
      action: "Application submitted",
      user: "Jane Doe",
      timestamp: "8 hours ago",
      type: "application",
    },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || user.status.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-100"
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "blocked":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "student":
        return "text-blue-600 bg-blue-100"
      case "recruiter":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

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
                <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Welcome back, {adminProfile.name}</p>
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
                onClick={() => navigate("/")}
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
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "overview" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "users" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>User Management</span>
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "analytics" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
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
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                        <p className="text-xs text-green-600">+12% from last month</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Jobs</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                        <p className="text-xs text-green-600">+8% from last month</p>
                      </div>
                      <Briefcase className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Recruiters</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activeRecruiters}</p>
                        <p className="text-xs text-green-600">+5% from last month</p>
                      </div>
                      <Shield className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending Approvals</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                        <p className="text-xs text-yellow-600">Requires attention</p>
                      </div>
                      <Activity className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div
                          className={`w-2 h-2 rounded-full ${
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
                          <p className="text-sm text-gray-900">{activity.action}</p>
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
                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
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
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Organization
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Login
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.role === "Student" ? user.college : user.company}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900">
                                  <UserCheck className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <UserX className="w-4 h-4" />
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

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Placeholder Charts */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-600">User Growth Chart</p>
                        <p className="text-sm text-gray-500">Chart visualization would go here</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Applications</h3>
                    <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-2" />
                        <p className="text-gray-600">Applications Chart</p>
                        <p className="text-sm text-gray-500">Chart visualization would go here</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
                    <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                        <p className="text-gray-600">Distribution Chart</p>
                        <p className="text-sm text-gray-500">Chart visualization would go here</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Activity</h3>
                    <div className="h-64 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                        <p className="text-gray-600">Activity Chart</p>
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
