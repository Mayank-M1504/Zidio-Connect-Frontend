 "use client"

import { Dialog, DialogContent, DialogTitle, DialogClose } from "../../components/ui/dialog";
import { useState, useEffect } from "react"
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
  X,
} from "lucide-react"

// Admin API models
export interface AdminDocument {
  id: number;
  name: string;
  url: string;
  type: string; // e.g., resume, marksheet, GST, PAN, etc.
}

export interface AdminCertificate {
  id: number;
  name: string;
  url: string;
}

export interface AdminStudentProfile {
  id: number;
  name: string;
  email: string;
  college: string;
  course: string;
  yearOfStudy: string;
  documents: AdminDocument[];
  certificates: AdminCertificate[];
  phone?: string;
  gpa?: string;
  academicAchievements?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioWebsite?: string;
  dateOfBirth?: string;
  address?: string;
  bio?: string;
  careerGoals?: string;
  skills?: string[];
  interests?: string[];
  preferredJobRoles?: string[];
  preferredLocations?: string[];
}

export interface AdminRecruiterProfile {
  id: number;
  name: string;
  email: string;
  company: string;
  companyLogo: string | null;
  documents: AdminDocument[];
  phone?: string;
  companyWebsite?: string;
  companyAddress?: string;
  companyDescription?: string;
  recruiterRole?: string;
  linkedinProfile?: string;
  stinNumber?: string;
}

// Use AdminStudentProfile and AdminRecruiterProfile for user management

// Type guard for AdminStudentProfile
function isAdminStudentProfile(user: AdminStudentProfile | AdminRecruiterProfile): user is AdminStudentProfile {
  return (user as AdminStudentProfile).college !== undefined;
}
// Type guard for AdminRecruiterProfile
function isAdminRecruiterProfile(user: AdminStudentProfile | AdminRecruiterProfile): user is AdminRecruiterProfile {
  return (user as AdminRecruiterProfile).company !== undefined;
}

// Helper for pie chart SVG
function PieChart({ data = [], colors, size = 120 }: { data?: number[]; colors: string[]; size?: number }) {
  if (!Array.isArray(data) || data.length === 0 || data.every(v => v === 0)) {
    return (
      <div style={{ width: size, height: size }} className="flex items-center justify-center mx-auto">
        <span className="text-gray-400 text-sm">No data</span>
      </div>
    );
  }
  const total = data.reduce((a, b) => a + b, 0);
  let cumulative = 0;
  const radius = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {data.map((value, i) => {
        const startAngle = (cumulative / total) * 2 * Math.PI;
        const endAngle = ((cumulative + value) / total) * 2 * Math.PI;
        const x1 = cx + radius * Math.sin(startAngle);
        const y1 = cy - radius * Math.cos(startAngle);
        const x2 = cx + radius * Math.sin(endAngle);
        const y2 = cy - radius * Math.cos(endAngle);
        const largeArc = value / total > 0.5 ? 1 : 0;
        const pathData = `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
        cumulative += value;
        return <path key={i} d={pathData} fill={colors[i]} />;
      })}
    </svg>
  );
}
// Helper for bar chart SVG
function BarChart({ data, labels, colors, width = 180, height = 80 }: { data: number[]; labels: string[]; colors: string[]; width?: number; height?: number }) {
  const max = Math.max(...data, 1);
  const barWidth = width / data.length - 10;
  return (
    <svg width={width} height={height + 20} className="mx-auto">
      {data.map((value, i) => (
        <g key={i}>
          <rect
            x={i * (barWidth + 10) + 10}
            y={height - (value / max) * height + 10}
            width={barWidth}
            height={(value / max) * height}
            fill={colors[i]}
            rx={4}
          />
          <text x={i * (barWidth + 10) + 10 + barWidth / 2} y={height + 18} textAnchor="middle" fontSize="12" fill="#555">{labels[i]}</text>
        </g>
      ))}
    </svg>
  );
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userType, setUserType] = useState("all") // "all", "student", "recruiter"
  const [searchTerm, setSearchTerm] = useState("")
  // Remove filterStatus state
  const router = useRouter()

  // Add a new state for the search input
  const [searchInput, setSearchInput] = useState("");

  // API state
  const [students, setStudents] = useState<AdminStudentProfile[]>([]);
  const [recruiters, setRecruiters] = useState<AdminRecruiterProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedUser, setSelectedUser] = useState<AdminStudentProfile | AdminRecruiterProfile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocumentToView, setSelectedDocumentToView] = useState<any | null>(null);
  const [docActionLoading, setDocActionLoading] = useState(false);

  // Add jobs state
  const [jobs, setJobs] = useState([]);
  // Add a new state for the active job management tab
  const [jobActionLoading, setJobActionLoading] = useState<number | null>(null);

  // Add a helper to fetch jobs (for reuse after approve/reject)
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/jobs?all=true', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setJobs([]);
    }
  };

  // Fetch admin profiles from backend
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not authenticated. Please log in.');
          setLoading(false);
          return;
        }
        const res = await fetch('http://localhost:8080/api/admin/profiles', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch profiles: ${res.status}`);
        }
        const data = await res.json();
        setStudents(Array.isArray(data.students) ? data.students : []);
        setRecruiters(Array.isArray(data.recruiters) ? data.recruiters : []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profiles');
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // In useEffect, call fetchJobs
  useEffect(() => {
    fetchJobs();
  }, []);

  // Empty placeholders for admin data
  const adminProfile = null;
  const stats = null;
  // Use AdminStudentProfile and AdminRecruiterProfile for user management
  const recentActivities: any[] = [];

  // Filter users based on type and search
  const getFilteredUsers = () => {
    let users: (AdminStudentProfile | AdminRecruiterProfile)[] = [];
    if (userType === "student") {
      users = students;
    } else if (userType === "recruiter") {
      users = recruiters;
    } else {
      users = [...students, ...recruiters];
    }
    return users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (isAdminRecruiterProfile(user) && user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (isAdminStudentProfile(user) && user.college && user.college.toLowerCase().includes(searchTerm.toLowerCase()));
      // No status field in new DTOs, so skip filterStatus
      return matchesSearch;
    });
  };

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

  // Placeholder handlers for toggling status
  async function handleApproveDocument(doc: any) {
    setDocActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const isCertificate = !!doc.certificateName || (!doc.type && doc.name);
      const url = isCertificate
        ? `http://localhost:8080/api/documents/admin/certificate-status/${doc.id}?status=APPROVED`
        : `http://localhost:8080/api/documents/admin/document-status/${doc.id}?status=APPROVED`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to approve');
      updateDocumentStatusInState(doc, 'APPROVED');
      setSelectedDocumentToView({ ...doc, status: 'APPROVED' });
    } catch (err) {
      alert('Failed to approve: ' + (err as any).message);
    } finally {
      setDocActionLoading(false);
    }
  }

  async function handleRejectDocument(doc: any) {
    setDocActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const isCertificate = !!doc.certificateName || (!doc.type && doc.name);
      const url = isCertificate
        ? `http://localhost:8080/api/documents/admin/certificate-status/${doc.id}?status=REJECTED`
        : `http://localhost:8080/api/documents/admin/document-status/${doc.id}?status=REJECTED`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to reject');
      updateDocumentStatusInState(doc, 'REJECTED');
      setSelectedDocumentToView({ ...doc, status: 'REJECTED' });
    } catch (err) {
      alert('Failed to reject: ' + (err as any).message);
    } finally {
      setDocActionLoading(false);
    }
  }

  function updateDocumentStatusInState(doc: any, status: string) {
    setStudents(prev => prev.map(s => ({
      ...s,
      documents: s.documents.map(d => d.id === doc.id ? { ...d, status } : d),
      certificates: s.certificates ? s.certificates.map(c => c.id === doc.id ? { ...c, status } : c) : s.certificates,
    })));
    setRecruiters(prev => prev.map(r => ({
      ...r,
      documents: r.documents.map(d => d.id === doc.id ? { ...d, status } : d),
    })));
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
                <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Welcome back, Admin</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
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
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
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
                  <span>Job Management</span>
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
                        <p className="text-2xl font-bold text-gray-900 mt-1">{students.length + recruiters.length}</p>
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
                        <p className="text-2xl font-bold text-gray-900 mt-1">{students.length}</p>
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
                        <p className="text-2xl font-bold text-gray-900 mt-1">{recruiters.length}</p>
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
                        <p className="text-2xl font-bold text-gray-900 mt-1">{jobs.length}</p>
                        <p className="text-xs text-green-600 mt-1">💼 Opportunities</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <Briefcase className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
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
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setSearchTerm(searchInput);
                          }
                        }}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
                              </div>

                {/* Users List */}
                <div className="space-y-4">
                  {loading && <div>Loading users...</div>}
                  {error && <div className="text-red-600">{error}</div>}
                  {!loading && !error && getFilteredUsers().map((user) => (
                    <div
                      key={user.id}
                      className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-300 border border-gray-100 cursor-pointer"
                      onClick={() => { setSelectedUser(user); setShowModal(true); }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex items-center gap-3 font-semibold text-gray-900">
                          {user.name}
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${isAdminStudentProfile(user) ? 'text-blue-600 bg-blue-100 border-blue-200' : 'text-purple-600 bg-purple-100 border-purple-200'}`}>
                            {isAdminStudentProfile(user) ? 'Student' : 'Recruiter'}
                              </span>
                        </div>
                        <div className="text-gray-600 text-sm">{user.email}</div>
                      </div>
                    </div>
                  ))}
                  {/* Modal for user details */}
                  {showModal && selectedUser && (
                    <Dialog open={showModal} onOpenChange={setShowModal}>
                      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
                        <div className="flex flex-col md:flex-row gap-8 p-4">
                          {/* Left column: Profile sections */}
                          <div className="flex-1 min-w-[260px] space-y-6 border-r border-gray-200 pr-6">
                            {isAdminStudentProfile(selectedUser) ? (
                              <div className="space-y-6">
                                {/* Profile Section */}
                                <div>
                                  <div className="text-xl font-bold mb-2">Profile</div>
                                  <div className="grid grid-cols-1 gap-2">
                                    <div><span className="font-medium">Full Name:</span> {selectedUser.name}</div>
                                    <div><span className="font-medium">Email:</span> {selectedUser.email}</div>
                                    {selectedUser.phone && <div><span className="font-medium">Phone:</span> {selectedUser.phone}</div>}
                                    <div><span className="font-medium">College:</span> {selectedUser.college}</div>
                                  </div>
                                </div>
                                <hr className="my-2 border-gray-200" />
                                {/* Academics Section */}
                                <div>
                                  <div className="text-lg font-semibold mb-2">Academics</div>
                                  <div className="grid grid-cols-1 gap-2">
                                    <div><span className="font-medium">Course:</span> {selectedUser.course}</div>
                                    <div><span className="font-medium">Year of Study:</span> {selectedUser.yearOfStudy}</div>
                                    {selectedUser.gpa && <div><span className="font-medium">GPA:</span> {selectedUser.gpa}</div>}
                                    {selectedUser.academicAchievements && <div><span className="font-medium">Achievements:</span> {selectedUser.academicAchievements}</div>}
                                  </div>
                                </div>
                                <hr className="my-2 border-gray-200" />
                                {/* Professional Section */}
                                <div>
                                  <div className="text-lg font-semibold mb-2">Professional</div>
                                  <div className="grid grid-cols-1 gap-2">
                                    <div className="flex flex-wrap gap-2">
                                      {selectedUser.linkedinProfile && <span><span className="font-medium">LinkedIn:</span> <a href={selectedUser.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{selectedUser.linkedinProfile}</a></span>}
                                      {selectedUser.githubProfile && <span><span className="font-medium">GitHub:</span> <a href={selectedUser.githubProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{selectedUser.githubProfile}</a></span>}
                                    </div>
                                    {selectedUser.portfolioWebsite && <div><span className="font-medium">Portfolio:</span> <a href={selectedUser.portfolioWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{selectedUser.portfolioWebsite}</a></div>}
                                    {selectedUser.skills && selectedUser.skills.length > 0 && <div><span className="font-medium">Skills:</span> {selectedUser.skills.join(', ')}</div>}
                                  </div>
                                </div>
                                <hr className="my-2 border-gray-200" />
                                {/* Personal Section */}
                                <div>
                                  <div className="text-lg font-semibold mb-2">Personal</div>
                                  <div className="grid grid-cols-1 gap-2">
                                    {selectedUser.dateOfBirth && <div><span className="font-medium">Date of Birth:</span> {selectedUser.dateOfBirth}</div>}
                                    {selectedUser.address && <div><span className="font-medium">Address:</span> {selectedUser.address}</div>}
                                    {selectedUser.bio && <div><span className="font-medium">Bio:</span> {selectedUser.bio}</div>}
                                  </div>
                                </div>
                                <hr className="my-2 border-gray-200" />
                                {/* Preferences Section */}
                                <div>
                                  <div className="text-lg font-semibold mb-2">Preferences</div>
                                  <div className="grid grid-cols-1 gap-2">
                                    {selectedUser.careerGoals && <div><span className="font-medium">Career Goals:</span> {selectedUser.careerGoals}</div>}
                                    {selectedUser.interests && selectedUser.interests.length > 0 && <div><span className="font-medium">Interests:</span> {selectedUser.interests.join(', ')}</div>}
                                    {selectedUser.preferredJobRoles && selectedUser.preferredJobRoles.length > 0 && <div><span className="font-medium">Preferred Job Roles:</span> {selectedUser.preferredJobRoles.join(', ')}</div>}
                                    {selectedUser.preferredLocations && selectedUser.preferredLocations.length > 0 && <div><span className="font-medium">Preferred Locations:</span> {selectedUser.preferredLocations.join(', ')}</div>}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-6">
                                {/* Profile Section */}
                                <div>
                                  <div className="text-xl font-bold mb-2">Profile</div>
                                  <div className="grid grid-cols-1 gap-2">
                                    <div><span className="font-medium">Full Name:</span> {selectedUser.name}</div>
                                    <div><span className="font-medium">Email:</span> {selectedUser.email}</div>
                                    {selectedUser.phone && <div><span className="font-medium">Phone:</span> {selectedUser.phone}</div>}
                                  </div>
                                </div>
                                <hr className="my-2 border-gray-200" />
                                {/* Company Section */}
                                <div>
                                  <div className="text-lg font-semibold mb-2">Company</div>
                                  <div className="grid grid-cols-1 gap-2">
                                    <div><span className="font-medium">Company Name:</span> {selectedUser.company}</div>
                                    {selectedUser.companyWebsite && <div><span className="font-medium">Website:</span> <a href={selectedUser.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{selectedUser.companyWebsite}</a></div>}
                                    {selectedUser.companyAddress && <div><span className="font-medium">Address:</span> {selectedUser.companyAddress}</div>}
                                    {selectedUser.companyDescription && <div><span className="font-medium">Description:</span> {selectedUser.companyDescription}</div>}
                                  </div>
                                </div>
                                <hr className="my-2 border-gray-200" />
                                {/* Professional Section */}
                                <div>
                                  <div className="text-lg font-semibold mb-2">Professional</div>
                                  <div className="grid grid-cols-1 gap-2">
                                    {selectedUser.recruiterRole && <div><span className="font-medium">Role:</span> {selectedUser.recruiterRole}</div>}
                                    {selectedUser.linkedinProfile && <div><span className="font-medium">LinkedIn:</span> <a href={selectedUser.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{selectedUser.linkedinProfile}</a></div>}
                                    {selectedUser.stinNumber && <div><span className="font-medium">STIN Number:</span> {selectedUser.stinNumber}</div>}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Right column: Documents and Certificates tables */}
                          <div className="flex-1 min-w-[320px] space-y-8">
                            {/* Documents Table */}
                            <div className="bg-gray-50 rounded-lg shadow-sm p-4 border border-gray-200">
                              <div className="font-semibold text-lg mb-2">Documents</div>
                              <table className="w-full border text-sm">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="py-2 px-3 text-left">Name</th>
                                    <th className="py-2 px-3 text-left">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedUser.documents.map((doc, idx) => (
                                    <tr key={doc.id + '-' + doc.type + '-' + idx} className="border-t">
                                      <td className="py-2 px-3">
                                        <span className="font-medium">{doc.type}</span>: <a href="#" onClick={e => { e.preventDefault(); setSelectedDocumentToView(doc); }} className="text-blue-600 hover:underline cursor-pointer">{doc.name}</a>
                                      </td>
                                      <td className="py-2 px-3">
                                        <button
                                          className={`px-3 py-1 rounded text-xs font-semibold ${doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' : doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                                          onClick={() => handleToggleDocumentStatus(doc)}
                                          disabled
                                        >
                                          {doc.status || 'PENDING'}
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            {/* Certificates Table (students only) */}
                            {isAdminStudentProfile(selectedUser) && (
                              <div className="bg-gray-50 rounded-lg shadow-sm p-4 border border-gray-200">
                                <div className="font-semibold text-lg mb-2">Certificates</div>
                                <table className="w-full border text-sm">
                                  <thead>
                                    <tr className="bg-gray-100">
                                      <th className="py-2 px-3 text-left">Name</th>
                                      <th className="py-2 px-3 text-left">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedUser.certificates.map((cert, idx) => (
                                      <tr key={cert.id + '-' + cert.name + '-' + idx} className="border-t">
                                        <td className="py-2 px-3">
                                          <a href="#" onClick={e => { e.preventDefault(); setSelectedDocumentToView(cert); }} className="text-blue-600 hover:underline cursor-pointer">{cert.name}</a>
                                        </td>
                                        <td className="py-2 px-3">
                                          <button
                                            className={`px-3 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700`}
                                            onClick={() => handleToggleCertificateStatus(cert)}
                                          >
                                            Pending
                                          </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                            )}
                          </div>
                        </div>
                        <DialogClose asChild>
                          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors absolute top-4 right-4 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 z-10" aria-label="Close">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  )}
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
                  {/* User Distribution Pie Chart */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">User Distribution</h3>
                    <PieChart data={[students.length, recruiters.length]} colors={["#3b82f6", "#a78bfa"]} />
                    <div className="flex justify-center gap-4 mt-2">
                      <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span> Students: {students.length}</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-purple-500"></span> Recruiters: {recruiters.length}</span>
                      </div>
                    </div>
                  {/* Job Status Pie Chart */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Status Distribution</h3>
                    <PieChart data={[
                      jobs.filter(j => j.adminApprovalStatus === 'APPROVED').length,
                      jobs.filter(j => j.adminApprovalStatus === 'PENDING' || !j.adminApprovalStatus).length,
                      jobs.filter(j => j.adminApprovalStatus === 'REJECTED').length
                    ]} colors={["#22c55e", "#facc15", "#ef4444"]} />
                    <div className="flex justify-center gap-4 mt-2">
                      <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-500"></span> Approved</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span> Pending</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-red-500"></span> Rejected</span>
                  </div>
                      </div>
                  {/* Jobs per Status Bar Chart */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-center col-span-1 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Jobs per Status</h3>
                    <BarChart
                      data={[
                        jobs.filter(j => j.adminApprovalStatus === 'APPROVED').length,
                        jobs.filter(j => j.adminApprovalStatus === 'PENDING' || !j.adminApprovalStatus).length,
                        jobs.filter(j => j.adminApprovalStatus === 'REJECTED').length
                      ]}
                      labels={["Approved", "Pending", "Rejected"]}
                      colors={["#22c55e", "#facc15", "#ef4444"]}
                    />
                    </div>
                  </div>
                      </div>
            )}

            {/* Job Management Tab */}
            {activeTab === "jobs" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
                  <p className="text-gray-600 mt-1">View and manage all jobs. Approve or reject jobs as needed.</p>
                </div>
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <table className="w-full border text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-3 text-left">Job Name</th>
                        <th className="py-2 px-3 text-left">Company</th>
                        <th className="py-2 px-3 text-left">Status</th>
                        <th className="py-2 px-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job: any) => (
                        <tr key={job.id} className="border-t">
                          <td className="py-2 px-3 font-medium">{job.title}</td>
                          <td className="py-2 px-3">{job.companyName || (job.recruiter && job.recruiter.company) || '-'}</td>
                          <td className="py-2 px-3">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${job.adminApprovalStatus === 'APPROVED' ? 'bg-green-100 text-green-800' : job.adminApprovalStatus === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{job.adminApprovalStatus || 'PENDING'}</span>
                          </td>
                          <td className="py-2 px-3 space-x-2">
                            <button
                              className="px-3 py-1 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
                              disabled={jobActionLoading === job.id || job.adminApprovalStatus === 'APPROVED' || job.adminApprovalStatus === 'REJECTED'}
                              onClick={async () => {
                                setJobActionLoading(job.id);
                                try {
                                  const token = localStorage.getItem('token');
                                  const res = await fetch(`http://localhost:8080/api/recruiter/jobs/admin/approve/${job.id}?status=APPROVED`, {
                                    method: 'PATCH',
                                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                                  });
                                  if (!res.ok) throw new Error('Failed to approve');
                                  await fetchJobs();
                                  alert('Job approved successfully!');
                                } catch (err) {
                                  alert('Failed to approve: ' + (err as any).message);
                                } finally {
                                  setJobActionLoading(null);
                                }
                              }}
                            >
                              {jobActionLoading === job.id ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                              className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
                              disabled={jobActionLoading === job.id || job.adminApprovalStatus === 'REJECTED' || job.adminApprovalStatus === 'APPROVED'}
                              onClick={async () => {
                                setJobActionLoading(job.id);
                                try {
                                  const token = localStorage.getItem('token');
                                  const res = await fetch(`http://localhost:8080/api/recruiter/jobs/admin/approve/${job.id}?status=REJECTED`, {
                                    method: 'PATCH',
                                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                                  });
                                  if (!res.ok) throw new Error('Failed to reject');
                                  await fetchJobs();
                                  alert('Job rejected successfully!');
                                } catch (err) {
                                  alert('Failed to reject: ' + (err as any).message);
                                } finally {
                                  setJobActionLoading(null);
                                }
                              }}
                            >
                              {jobActionLoading === job.id ? 'Rejecting...' : 'Reject'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Document Viewer Modal */}
      {selectedDocumentToView && (
        <Dialog open={!!selectedDocumentToView} onOpenChange={open => { if (!open) setSelectedDocumentToView(null); }}>
          <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-0">
            <DialogClose asChild>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors absolute top-4 right-4 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 z-10" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
            <div className="p-4">
              <div className="font-semibold text-lg mb-4">Viewing: {selectedDocumentToView.name}</div>
              {selectedDocumentToView.url &&
                (selectedDocumentToView.url.endsWith('.pdf') ? (
                  <iframe src={selectedDocumentToView.url} title="Document Viewer" className="w-full min-h-[60vh] rounded border" />
                ) : (
                  <img src={selectedDocumentToView.url} alt={selectedDocumentToView.name} className="max-w-full max-h-[70vh] rounded border mx-auto" />
                ))
              }
              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="px-5 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow disabled:opacity-60 flex items-center justify-center"
                  onClick={() => handleApproveDocument(selectedDocumentToView)}
                  disabled={docActionLoading}
                >
                  {docActionLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Approving...
                    </span>
                  ) : (
                    "Approve"
                  )}
                </button>
                <button
                  className="px-5 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow disabled:opacity-60 flex items-center justify-center"
                  onClick={() => handleRejectDocument(selectedDocumentToView)}
                  disabled={docActionLoading}
                >
                  {docActionLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Rejecting...
                    </span>
                  ) : (
                    "Reject"
                  )}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

