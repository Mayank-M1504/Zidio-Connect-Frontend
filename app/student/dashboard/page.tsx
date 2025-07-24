"use client"

import { useState, useRef, useEffect } from "react"
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
  Download,
  Trash2,
  MessageCircle,
} from "lucide-react"
import { createOrUpdateStudentProfile, getCurrentStudentProfile, StudentProfileData, uploadStudentDocument, uploadStudentCertificate, getStudentDocuments, deleteStudentDocument, deleteStudentCertificate, getAllJobs, Job, getMyApplications } from '../../../lib/api';
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/avatar';
import DocumentViewer from '../../../components/DocumentViewer';
import MessageModal from '../../../components/MessageModal';

// Utility to decode JWT and extract email
function getEmailFromJWT() {
  if (typeof window === 'undefined') return '';
  const token = localStorage.getItem('token');
  if (!token) return '';
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const { sub, email } = JSON.parse(jsonPayload);
    // Some JWTs use 'sub' for email, some use 'email'
    return email || sub || '';
  } catch {
    return '';
  }
}

function formatDateForInput(dateString: string | undefined): string {
  if (!dateString) return '';
  // If already in YYYY-MM-DD, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  // Try to parse and format
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

type ProfileType = {
  firstName: string;
  lastName: string;
  phone: string;
  college: string;
  course: string;
  yearOfStudy: string;
  gpa: string;
  expectedGraduation: string;
  academicAchievements: string;
  linkedinProfile: string;
  githubProfile: string;
  portfolioWebsite: string;
  dateOfBirth: string;
  address: string;
  bio: string;
  careerGoals: string;
  skills: string[];
  interests: string[];
  preferredJobRoles: string[];
  preferredLocations: string[];
  profilePicture?: string | null;
};

const initialProfile: ProfileType = {
  firstName: '',
  lastName: '',
  phone: '',
  college: '',
  course: '',
  yearOfStudy: '',
  gpa: '',
  expectedGraduation: '',
  academicAchievements: '',
  linkedinProfile: '',
  githubProfile: '',
  portfolioWebsite: '',
  dateOfBirth: '',
  address: '',
  bio: '',
  careerGoals: '',
  skills: [],
  interests: [],
  preferredJobRoles: [],
  preferredLocations: [],
  profilePicture: null,
};

// Add helper functions for profile completeness and document verification
function isProfileComplete(profile: ProfileType) {
  return (
    profile.firstName &&
    profile.lastName &&
    profile.phone &&
    profile.college &&
    profile.course &&
    profile.yearOfStudy &&
    profile.gpa &&
    profile.skills.length > 0 &&
    profile.interests.length > 0 &&
    profile.careerGoals &&
    profile.profilePicture
  );
}

function areDocumentsVerified(uploadedDocuments: any) {
  const resume = uploadedDocuments.documents.find((d: any) => d.type === 'resume' && d.status === 'APPROVED');
  const marksheet = uploadedDocuments.documents.find((d: any) => d.type === 'marksheet' && d.status === 'APPROVED');
  // You can add more required docs if needed
  return resume && marksheet;
}

export default function StudentDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState('');
  console.log("StudentDashboard (app/student/dashboard/page.tsx) component loaded");
  const [activeTab, setActiveTab] = useState("jobs")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const router = useRouter()

  // Certificate input state
  const [certificates, setCertificates] = useState<Array<{ name: string; file: File | null }>>([{ name: "", file: null }])

  // Re-add refs and state for file inputs
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const marksheetInputRef = useRef<HTMLInputElement>(null);
  const identityInputRef = useRef<HTMLInputElement>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

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

  
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [marksheetFile, setMarksheetFile] = useState<File | null>(null)
  const [identityFile, setIdentityFile] = useState<File | null>(null)

  const [jwtEmail, setJwtEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [profile, setProfile] = useState<ProfileType>(initialProfile);

  // Add these to the top of the StudentDashboard function, after useState declarations
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [preferredJobRoleInput, setPreferredJobRoleInput] = useState("");
  const [preferredLocationInput, setPreferredLocationInput] = useState("");

  // Add state for upload status
  const [profilePicUploadStatus, setProfilePicUploadStatus] = useState<string | null>(null);
  const [profilePicUploading, setProfilePicUploading] = useState(false);

  // Add state for document uploads
  const [resumeUploadStatus, setResumeUploadStatus] = useState<string | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [marksheetUploadStatus, setMarksheetUploadStatus] = useState<string | null>(null);
  const [marksheetUploading, setMarksheetUploading] = useState(false);
  const [identityUploadStatus, setIdentityUploadStatus] = useState<string | null>(null);
  const [identityUploading, setIdentityUploading] = useState(false);
  const [certificateUploadStatus, setCertificateUploadStatus] = useState<string | null>(null);
  const [certificateUploading, setCertificateUploading] = useState(false);

  // Add state for uploaded documents
  const [uploadedDocuments, setUploadedDocuments] = useState<any>({ documents: [], certificates: [] });

  // Add state for selected document
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  // Add state for Apply Now modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyJob, setApplyJob] = useState<any>(null);
  const [applicantAnswer, setApplicantAnswer] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');

  // Add state for Apply Now tooltip
  const [applyTooltipJobId, setApplyTooltipJobId] = useState<number | null>(null);

  // Add state for chat modal
  const [chatAppId, setChatAppId] = useState<number|null>(null);
  const [chatReceiverEmail, setChatReceiverEmail] = useState<string>('');
  const [chatReceiverRole, setChatReceiverRole] = useState<string>('');

  // Add state for job details modal
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [jobDetails, setJobDetails] = useState<any>(null);

  // Add state for filter expansion and filter values
  const [showFilters, setShowFilters] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const [filterStipendMin, setFilterStipendMin] = useState('');
  const [filterStipendMax, setFilterStipendMax] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

  // Get unique values for dropdowns from jobs list
  const departmentOptions = Array.from(new Set(jobs.map(j => j.department).filter(Boolean)));
  const locationOptions = Array.from(new Set(jobs.map(j => j.location).filter(Boolean)));
  const durationOptions = Array.from(new Set(jobs.map(j => j.duration).filter(Boolean)));

  // Filtering and sorting logic
  const filteredAndSortedJobs = jobs
    .filter((job) => job.adminApprovalStatus === 'APPROVED')
    .filter((job) =>
      (filterType === 'all' || job.jobType?.toLowerCase() === filterType) &&
      (searchTerm === '' ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterDepartment === '' || job.department === filterDepartment) &&
      (filterLocation === '' || job.location === filterLocation) &&
      (filterDuration === '' || job.duration === filterDuration) &&
      (filterStipendMin === '' || parseInt(job.stipendSalary?.replace(/\D/g, '') || '0') >= parseInt(filterStipendMin)) &&
      (filterStipendMax === '' || parseInt(job.stipendSalary?.replace(/\D/g, '') || '0') <= parseInt(filterStipendMax))
    )
    .sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'Oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'Highest Stipend') {
        const aStipend = parseInt(a.stipendSalary?.replace(/\D/g, '') || '0');
        const bStipend = parseInt(b.stipendSalary?.replace(/\D/g, '') || '0');
        return bStipend - aStipend;
      }
      return 0;
    });

  // Fetch profile on mount
  useEffect(() => {
    setJwtEmail(getEmailFromJWT());
    getCurrentStudentProfile().then((data: StudentProfileData) => {
      const newProfile = {
        ...initialProfile,
        ...data,
        skills: data.skills || [],
        interests: data.interests || [],
        preferredJobRoles: data.preferredJobRoles || [],
        preferredLocations: data.preferredLocations || [],
        dateOfBirth: formatDateForInput(data.dateOfBirth),
        profilePicture: data.profilePicture || null,
      };
      setProfile(newProfile);
    }).catch(() => {});
    
    // Fetch uploaded documents
    fetchUploadedDocuments();
    // eslint-disable-next-line
  }, []);

  const fetchUploadedDocuments = async () => {
    try {
      const data = await getStudentDocuments();
      setUploadedDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const handleDocumentUpload = async (file: File | null, type: string, setUploading: (loading: boolean) => void, setStatus: (status: string | null) => void) => {
    if (!file) return;
    
    setUploading(true);
    setStatus(null);
    try {
      await uploadStudentDocument(file, type);
      setStatus('Document uploaded successfully!');
      fetchUploadedDocuments(); // Refresh the list
    } catch (err: any) {
      setStatus('Failed to upload document: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleCertificateUpload = async (file: File | null, certificateName: string) => {
    if (!file || !certificateName.trim()) return;
    
    setCertificateUploading(true);
    setCertificateUploadStatus(null);
    try {
      await uploadStudentCertificate(file, certificateName);
      setCertificateUploadStatus('Certificate uploaded successfully!');
      fetchUploadedDocuments(); // Refresh the list
      // Reset the certificate form
      setCertificates([{ name: "", file: null }]);
    } catch (err: any) {
      setCertificateUploadStatus('Failed to upload certificate: ' + (err.message || 'Unknown error'));
    } finally {
      setCertificateUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: number, type: 'document' | 'certificate') => {
    try {
      if (type === 'document') {
        await deleteStudentDocument(documentId);
      } else {
        await deleteStudentCertificate(documentId);
      }
      fetchUploadedDocuments(); // Refresh the list
    } catch (err: any) {
      console.error('Failed to delete document:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc);
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

  // const filteredJobs = [];

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await createOrUpdateStudentProfile({
        ...profile,
        email: jwtEmail,
      });
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Add state and ref for profile picture upload
  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    setProfilePicUploading(true);
    console.log('Uploading file:', file);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/profile/upload-photo', {
        method: 'POST',
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const data = await res.json();
      console.log('Upload response:', data);
      if (data.profilePictureUrl) {
        setProfile((prev) => ({ ...prev, profilePicture: data.profilePictureUrl }));
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setProfilePicUploading(false);
    }
  };

  // Move these to the top, before any code that uses jobs


  useEffect(() => {
    if (activeTab === 'jobs') {
      setJobsLoading(true);
      setJobsError('');
      getAllJobs()
        .then((data) => {
          setJobs(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          setJobsError('Failed to load jobs');
        })
        .finally(() => setJobsLoading(false));
    }
  }, [activeTab]);

  // Add handler for Apply Now
  const handleApplyNow = (job: any) => {
    setApplyJob(job);
    setApplicantAnswer('');
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async () => {
    setApplyLoading(true);
    setApplyError('');
    setApplySuccess('');
    try {
      // Collect document IDs (assume resume, marksheet, certificates are uploaded and available in uploadedDocuments)
      const resume = uploadedDocuments.documents.find((d: any) => d.type === 'resume');
      const marksheet = uploadedDocuments.documents.find((d: any) => d.type === 'marksheet');
      const certificateIds = uploadedDocuments.certificates?.map((c: any) => c.id) || [];
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          jobId: applyJob.id,
          resumeId: resume?.id,
          marksheetId: marksheet?.id,
          certificateIds,
          answerForRecruiter: applicantAnswer,
        }),
      });
      if (!res.ok) throw new Error('Failed to apply');
      setApplySuccess('Application submitted successfully!');
      setShowApplyModal(false);
      // Refresh applications list after applying
      getMyApplications()
        .then((data) => setMyApplications(Array.isArray(data) ? data : []))
        .catch(() => {});
    } catch (err: any) {
      setApplyError(err.message || 'Failed to apply');
    } finally {
      setApplyLoading(false);
    }
  };

  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [myApplicationsLoading, setMyApplicationsLoading] = useState(false);
  const [myApplicationsError, setMyApplicationsError] = useState('');

  useEffect(() => {
    // Fetch applications on mount so the applications tab always has data
    setMyApplicationsLoading(true);
    setMyApplicationsError('');
    getMyApplications()
      .then((data) => setMyApplications(Array.isArray(data) ? data : []))
      .catch((err) => setMyApplicationsError('Failed to load applications'))
      .finally(() => setMyApplicationsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Document Viewer Modal at root level */}
      {selectedDocument && (
        <DocumentViewer document={selectedDocument} isAdmin={false} onStatusChange={undefined} onClose={() => setSelectedDocument(null)} />
      )}
      <input
        type="file"
        accept="image/*"
        ref={profilePicInputRef}
        style={{ display: "none" }}
        onChange={handleProfilePicChange}
      />
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Avatar className="w-10 h-10">
                  {profile.profilePicture ? (
                    <AvatarImage src={profile.profilePicture} alt="Profile" />
                  ) : (
                    <AvatarFallback>
                      <User className="w-6 h-6 text-gray-400" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-500">
                  Welcome back{profile.firstName || profile.lastName ? `, ${profile.firstName} ${profile.lastName}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button> */}
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

                {success && <div className="text-green-600 font-medium mb-4">{success}</div>}
                {error && <div className="text-red-600 font-medium mb-4">{error}</div>}

                <form className="space-y-8" onSubmit={handleProfileSubmit}>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center cursor-pointer"
                      onClick={() => profilePicInputRef.current && profilePicInputRef.current.click()}
                    >
                      {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <img src="/placeholder-user.jpg" alt="Default" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      ref={profilePicInputRef}
                      onChange={handleProfilePicChange}
                    />
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                      onClick={() => profilePicInputRef.current && profilePicInputRef.current.click()}
                      disabled={profilePicUploading}
                    >
                      {profilePicUploading ? 'Uploading...' : 'Change Photo'}
                    </button>
                  </div>
                  {/* Basic Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={profile.firstName}
                          onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={profile.lastName}
                          onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={jwtEmail}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                          readOnly
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={e => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">College/University</label>
                        <input
                          type="text"
                          value={profile.college}
                          onChange={e => setProfile({ ...profile, college: e.target.value })}
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
                          value={profile.course}
                          onChange={e => setProfile({ ...profile, course: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
                        <select
                          value={profile.yearOfStudy}
                          onChange={e => setProfile({ ...profile, yearOfStudy: e.target.value })}
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
                          value={profile.gpa}
                          onChange={e => setProfile({ ...profile, gpa: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 8.5 or 3.8"
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
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={skillInput}
                            onChange={e => setSkillInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter" && skillInput.trim()) {
                                e.preventDefault();
                                if (!profile.skills.includes(skillInput.trim())) {
                                  setProfile({ ...profile, skills: [...profile.skills, skillInput.trim()] });
                                }
                                setSkillInput("");
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Type a skill and press Enter"
                          />
                          <div className="flex flex-wrap gap-2 mt-1">
                            {profile.skills.map((skill, idx) => (
                              <span key={idx} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {skill}
                                <button
                                  type="button"
                                  className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                                  onClick={() => setProfile({ ...profile, skills: profile.skills.filter((_, i) => i !== idx) })}
                                  aria-label={`Remove skill ${skill}`}
                                >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                        </div>
                      {/* Resume upload removed from here */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                          <input
                            type="url"
                            value={profile.linkedinProfile}
                            onChange={e => setProfile({ ...profile, linkedinProfile: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                          <input
                            type="url"
                            value={profile.githubProfile}
                            onChange={e => setProfile({ ...profile, githubProfile: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://github.com/yourusername"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website</label>
                        <input
                          type="url"
                          value={profile.portfolioWebsite}
                          onChange={e => setProfile({ ...profile, portfolioWebsite: e.target.value })}
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
                          value={profile.dateOfBirth}
                          onChange={e => setProfile({ ...profile, dateOfBirth: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          type="text"
                          value={profile.address}
                          onChange={e => setProfile({ ...profile, address: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio/About Me</label>
                        <textarea
                          rows={4}
                          value={profile.bio}
                          onChange={e => setProfile({ ...profile, bio: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tell us about yourself, your interests, and what makes you unique..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={interestInput}
                            onChange={e => setInterestInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter" && interestInput.trim()) {
                                e.preventDefault();
                                if (!profile.interests.includes(interestInput.trim())) {
                                  setProfile({ ...profile, interests: [...profile.interests, interestInput.trim()] });
                                }
                                setInterestInput("");
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Type an interest and press Enter"
                          />
                          <div className="flex flex-wrap gap-2 mt-1">
                            {profile.interests.map((interest, idx) => (
                              <span key={idx} className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                              {interest}
                                <button
                                  type="button"
                                  className="ml-2 text-purple-500 hover:text-purple-700 focus:outline-none"
                                  onClick={() => setProfile({ ...profile, interests: profile.interests.filter((_, i) => i !== idx) })}
                                  aria-label={`Remove interest ${interest}`}
                                >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        </div>
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
                          value={profile.careerGoals}
                          onChange={e => setProfile({ ...profile, careerGoals: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe your career aspirations and long-term goals..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Job Roles</label>
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={preferredJobRoleInput}
                            onChange={e => setPreferredJobRoleInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter" && preferredJobRoleInput.trim()) {
                                e.preventDefault();
                                if (!profile.preferredJobRoles.includes(preferredJobRoleInput.trim())) {
                                  setProfile({ ...profile, preferredJobRoles: [...profile.preferredJobRoles, preferredJobRoleInput.trim()] });
                                }
                                setPreferredJobRoleInput("");
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Type a job role and press Enter"
                          />
                          <div className="flex flex-wrap gap-2 mt-1">
                            {profile.preferredJobRoles.map((role, idx) => (
                              <span key={idx} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              {role}
                                <button
                                  type="button"
                                  className="ml-2 text-green-500 hover:text-green-700 focus:outline-none"
                                  onClick={() => setProfile({ ...profile, preferredJobRoles: profile.preferredJobRoles.filter((_, i) => i !== idx) })}
                                  aria-label={`Remove job role ${role}`}
                                >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
                        <div className="flex flex-col gap-2">
                        <input
                          type="text"
                            value={preferredLocationInput}
                            onChange={e => setPreferredLocationInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter" && preferredLocationInput.trim()) {
                                e.preventDefault();
                                if (!profile.preferredLocations.includes(preferredLocationInput.trim())) {
                                  setProfile({ ...profile, preferredLocations: [...profile.preferredLocations, preferredLocationInput.trim()] });
                                }
                                setPreferredLocationInput("");
                              }
                            }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Type a location and press Enter"
                          />
                          <div className="flex flex-wrap gap-2 mt-1">
                            {profile.preferredLocations.map((location, idx) => (
                              <span key={idx} className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                              {location}
                                <button
                                  type="button"
                                  className="ml-2 text-yellow-500 hover:text-yellow-700 focus:outline-none"
                                  onClick={() => setProfile({ ...profile, preferredLocations: profile.preferredLocations.filter((_, i) => i !== idx) })}
                                  aria-label={`Remove location ${location}`}
                                >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        </div>
                      </div>
                    </div>
                      </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="bg-white rounded-xl shadow-sm p-6 animate-in fade-in-from-right duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Documents</h2>
                <div className="space-y-8">
                  {/* Profile Picture Section REMOVED */}
                  {/* Resume Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Resume</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload your latest resume</p>
                        <p className="text-xs text-gray-500 mb-3">Supported formats: PDF only (Max 10MB)</p>
                        <input
                          type="file"
                          accept=".pdf"
                          ref={resumeInputRef}
                          style={{ display: "none" }}
                          onChange={e => setResumeFile(e.target.files ? e.target.files[0] : null)}
                        />
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                            onClick={() => resumeInputRef.current?.click()}
                          >
                            {resumeFile ? "Change Resume" : "Select Resume"}
                          </button>
                          <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 font-medium disabled:opacity-50"
                            disabled={!resumeFile || resumeUploading}
                            onClick={() => handleDocumentUpload(resumeFile, 'resume', setResumeUploading, setResumeUploadStatus)}
                          >
                            {resumeUploading ? 'Uploading...' : 'Upload'}
                          </button>
                        </div>
                        {resumeFile && (
                          <div className="mt-1 text-xs text-gray-600">{resumeFile.name}</div>
                        )}
                        {resumeUploadStatus && (
                          <div className={resumeUploadStatus.includes('success') ? 'text-green-600' : 'text-red-600'}>
                            {resumeUploadStatus}
                          </div>
                        )}
                      </div>
                      {/* Uploaded resume table */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Resumes</h4>
                        {uploadedDocuments.documents?.filter((doc: any) => doc.type === 'resume').length > 0 ? (
                          <div className="space-y-2">
                            {uploadedDocuments.documents?.filter((doc: any) => doc.type === 'resume').map((doc: any) => (
                              <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(doc.fileSize)} • {formatDate(doc.uploadedAt)}</p>
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                    doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {doc.status}
                            </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button onClick={() => handleViewDocument(doc)} className="p-1 text-blue-600 hover:text-blue-800" title="View/Download">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDownloadDocument(doc)} className="p-1 text-green-600 hover:text-green-800" title="Download">
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteDocument(doc.id, 'document')} className="p-1 text-red-600 hover:text-red-800" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                          ))}
                        </div>
                        ) : (
                          <p className="text-sm text-gray-500">No resumes uploaded yet</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Marksheet Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Academic Marksheet</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload your latest marksheet</p>
                        <p className="text-xs text-gray-500 mb-3">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          ref={marksheetInputRef}
                          style={{ display: "none" }}
                          onChange={e => setMarksheetFile(e.target.files ? e.target.files[0] : null)}
                        />
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                            onClick={() => marksheetInputRef.current?.click()}
                          >
                            {marksheetFile ? "Change Marksheet" : "Select Marksheet"}
                          </button>
                          <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 font-medium disabled:opacity-50"
                            disabled={!marksheetFile || marksheetUploading}
                            onClick={() => handleDocumentUpload(marksheetFile, 'marksheet', setMarksheetUploading, setMarksheetUploadStatus)}
                          >
                            {marksheetUploading ? 'Uploading...' : 'Upload'}
                          </button>
                        </div>
                        {marksheetFile && (
                          <div className="mt-1 text-xs text-gray-600">{marksheetFile.name}</div>
                        )}
                        {marksheetUploadStatus && (
                          <div className={marksheetUploadStatus.includes('success') ? 'text-green-600' : 'text-red-600'}>
                            {marksheetUploadStatus}
                          </div>
                        )}
                      </div>
                      {/* Uploaded marksheet table */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Marksheets</h4>
                        {uploadedDocuments.documents?.filter((doc: any) => doc.type === 'marksheet').length > 0 ? (
                          <div className="space-y-2">
                            {uploadedDocuments.documents?.filter((doc: any) => doc.type === 'marksheet').map((doc: any) => (
                              <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(doc.fileSize)} • {formatDate(doc.uploadedAt)}</p>
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                    doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {doc.status}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button onClick={() => handleViewDocument(doc)} className="p-1 text-blue-600 hover:text-blue-800" title="View/Download">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDownloadDocument(doc)} className="p-1 text-green-600 hover:text-green-800" title="Download">
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteDocument(doc.id, 'document')} className="p-1 text-red-600 hover:text-red-800" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No marksheets uploaded yet</p>
                        )}
                      </div>
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
                          Aadhar Card, Passport, Driving License, etc. (Max 10MB)
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          ref={identityInputRef}
                          style={{ display: "none" }}
                          onChange={e => setIdentityFile(e.target.files ? e.target.files[0] : null)}
                        />
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                            onClick={() => identityInputRef.current?.click()}
                          >
                            {identityFile ? "Change Identity Proof" : "Select Identity Proof"}
                          </button>
                          <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 font-medium disabled:opacity-50"
                            disabled={!identityFile || identityUploading}
                            onClick={() => handleDocumentUpload(identityFile, 'identity_proof', setIdentityUploading, setIdentityUploadStatus)}
                          >
                            {identityUploading ? 'Uploading...' : 'Upload'}
                          </button>
                      </div>
                        {identityFile && (
                          <div className="mt-1 text-xs text-gray-600">{identityFile.name}</div>
                        )}
                        {identityUploadStatus && (
                          <div className={identityUploadStatus.includes('success') ? 'text-green-600' : 'text-red-600'}>
                            {identityUploadStatus}
                          </div>
                        )}
                      </div>
                      {/* Uploaded identity proof table */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Identity Proofs</h4>
                        {uploadedDocuments.documents?.filter((doc: any) => doc.type === 'identity_proof').length > 0 ? (
                          <div className="space-y-2">
                            {uploadedDocuments.documents?.filter((doc: any) => doc.type === 'identity_proof').map((doc: any) => (
                              <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(doc.fileSize)} • {formatDate(doc.uploadedAt)}</p>
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                    doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {doc.status}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button onClick={() => handleViewDocument(doc)} className="p-1 text-blue-600 hover:text-blue-800" title="View/Download">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDownloadDocument(doc)} className="p-1 text-green-600 hover:text-green-800" title="Download">
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteDocument(doc.id, 'document')} className="p-1 text-red-600 hover:text-red-800" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No identity proofs uploaded yet</p>
                        )}
                      </div>
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
                          Course certificates, internship certificates, awards, etc. (Max 10MB)
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
                              <div className="flex flex-col gap-2">
                    <button
                      type="button"
                                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium disabled:opacity-50"
                                  disabled={!cert.file || !cert.name.trim() || certificateUploading}
                                  onClick={() => handleCertificateUpload(cert.file, cert.name)}
                    >
                                  {certificateUploading ? 'Uploading...' : 'Upload'}
                    </button>
                    <button
                                  type="button"
                                  onClick={() => removeCertificate(idx)}
                                  className="text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-100 bg-red-50 text-xs font-medium shadow-sm disabled:opacity-50"
                                  disabled={certificates.length === 1}
                    >
                                  Remove
                    </button>
                  </div>
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
                        {certificateUploadStatus && (
                          <div className={certificateUploadStatus.includes('success') ? 'text-green-600' : 'text-red-600'}>
                            {certificateUploadStatus}
                          </div>
                        )}
                      </div>

                      {/* Uploaded Certificates Table */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Certificates</h4>
                        {uploadedDocuments.certificates?.length > 0 ? (
                          <div className="space-y-2">
                            {uploadedDocuments.certificates?.map((cert: any) => (
                              <div key={cert.id} className="flex items-center justify-between p-3 bg-white rounded border">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">{cert.certificateName}</p>
                                  <p className="text-xs text-gray-500">{cert.fileName} • {formatFileSize(cert.fileSize)} • {formatDate(cert.uploadedAt)}</p>
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                    cert.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    cert.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {cert.status}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button onClick={() => handleViewDocument(cert)} className="p-1 text-blue-600 hover:text-blue-800" title="View/Download">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDownloadDocument(cert)} className="p-1 text-green-600 hover:text-green-800" title="Download">
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteDocument(cert.id, 'certificate')} className="p-1 text-red-600 hover:text-red-800" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No certificates uploaded yet</p>
                        )}
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
                  <div className="flex flex-col md:flex-row gap-4 items-center">
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
                    
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 font-medium flex items-center gap-2"
                      onClick={() => setShowFilters((prev) => !prev)}
                    >
                      <span>Filters</span>
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                  {showFilters && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select
                          value={filterDepartment}
                          onChange={(e) => setFilterDepartment(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                          <option value="">All</option>
                          {departmentOptions.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                      </select>
                    </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <select
                          value={filterLocation}
                          onChange={(e) => setFilterLocation(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="">All</option>
                          {locationOptions.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                  </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <select
                          value={filterDuration}
                          onChange={(e) => setFilterDuration(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="">All</option>
                          {durationOptions.map((dur) => (
                            <option key={dur} value={dur}>{dur}</option>
                          ))}
                        </select>
                </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stipend Min</label>
                        <input
                          type="number"
                          value={filterStipendMin}
                          onChange={(e) => setFilterStipendMin(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="e.g. 10000"
                          min={0}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stipend Max</label>
                        <input
                          type="number"
                          value={filterStipendMax}
                          onChange={(e) => setFilterStipendMax(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="e.g. 50000"
                          min={0}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="Newest">Newest</option>
                          <option value="Oldest">Oldest</option>
                          <option value="Highest Stipend">Highest Stipend</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        className="absolute right-0 bottom-0 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                        onClick={() => {
                          setFilterDepartment('');
                          setFilterLocation('');
                          setFilterDuration('');
                          setFilterStipendMin('');
                          setFilterStipendMax('');
                          setSortBy('Newest');
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
                {/* Job Listings */}
                <div className="space-y-4">
                  {jobsLoading ? (
                    <div className="text-center text-gray-500">Loading jobs...</div>
                  ) : jobsError ? (
                    <div className="text-center text-red-500">{jobsError}</div>
                  ) : (
                    filteredAndSortedJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center mb-2">
                                {job.companyLogo ? (
                                  <img src={job.companyLogo} alt="Company Logo" className="inline-block w-10 h-10 object-contain rounded mr-4 align-middle" />
                                ) : (
                                  <div className="inline-block w-10 h-10 bg-gray-200 rounded mr-4 align-middle" />
                                )}
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                                <div className="text-gray-600 text-sm">{job.companyName || ''}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Building className="w-4 h-4" />
                                  <span>{job.department}</span>
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
                                <span>{job.stipendSalary}</span>
                              </div>
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                  job.jobType === "Internship" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                                }`}
                              >
                                {job.jobType}
                  </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            {/* <span className="text-sm text-gray-500">Posted {job.posted}</span> */}
                            <div
                              className="relative group"
                              style={{ display: 'inline-block' }}
                              onMouseEnter={() => setApplyTooltipJobId(job.id)}
                              onMouseLeave={() => setApplyTooltipJobId(null)}
                            >
                              {(() => {
                                // Check if already applied
                                const alreadyApplied = myApplications.some(
                                  (app) => app.jobId === job.id || app.job?.id === job.id
                                );
                                const disabled = alreadyApplied || !isProfileComplete(profile) || !areDocumentsVerified(uploadedDocuments);
                                let tooltipMsg = '';
                                if (alreadyApplied) {
                                  tooltipMsg = 'You have already applied to this job.';
                                } else if (!isProfileComplete(profile) && !areDocumentsVerified(uploadedDocuments)) {
                                  tooltipMsg = 'Please complete your profile and upload all required, approved documents to apply.';
                                } else if (!isProfileComplete(profile)) {
                                  tooltipMsg = 'Please complete your profile to apply.';
                                } else if (!areDocumentsVerified(uploadedDocuments)) {
                                  tooltipMsg = 'All required documents must be uploaded and approved to apply.';
                                }
                                return (
                                  <>
                                    <button
                                      className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                      onClick={() => { if (!disabled) { setJobDetails(job); setShowJobDetailsModal(true); } }}
                                      disabled={disabled}
                                      tabIndex={0}
                                      style={{ pointerEvents: !disabled ? 'auto' : 'none' }}
                                    >
                                      View
                                    </button>
                                    {applyTooltipJobId === job.id && tooltipMsg && (
                                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-20 flex flex-col items-center" style={{ minWidth: 240 }}>
                                        <div className="relative bg-yellow-100 text-yellow-900 text-xs rounded-xl px-3 py-2 shadow-lg border border-yellow-400 font-medium animate-fade-in" style={{ boxShadow: '0 4px 16px rgba(251,191,36,0.10)' }}>
                                          {tooltipMsg}
                                          <span className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-100"></span>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div className="bg-white rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h2>
                <div className="space-y-4">
                  {myApplicationsLoading ? (
                    <div className="text-center text-gray-500">Loading applications...</div>
                  ) : myApplicationsError ? (
                    <div className="text-center text-red-500">{myApplicationsError}</div>
                  ) : myApplications.length === 0 ? (
                    <div className="text-center text-gray-500">You have not applied to any jobs yet.</div>
                  ) : myApplications.map((app) => (
                      <div
                        key={app.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{app.jobTitle || app.job?.title}</h3>
                            <p className="text-gray-600 mb-2">{app.company || app.job?.companyName}</p>
                            <p className="text-sm text-gray-500">Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ''}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${app.status === 'Shortlisted' ? 'bg-green-100 text-green-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                              {app.status}
                  </span>
                </div>
              </div>
                        {/* Optionally add a button to view more details */}
                      </div>
                  ))}
          </div>
        </div>
            )}
      </div>
        </div>
      </div>
      {/* Application Modal */}
      {showApplyModal && applyJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-none shadow-xl w-full h-full p-0 border-0 animate-in fade-in-from-bottom duration-300 flex flex-col">
            <div className="flex justify-between items-center px-8 py-6 border-b">
              <div className="text-2xl font-bold text-gray-900">Review Your Application</div>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowApplyModal(false)}
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Profile Section */}
                <div className="relative mb-8">
                  <div className="flex items-center justify-between mb-4 border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                    <button
                      className="px-4 py-1 rounded border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 font-medium text-sm shadow-sm transition-all duration-150"
                      style={{ minWidth: 120 }}
                      onClick={() => { setShowApplyModal(false); setActiveTab('profile'); }}
                    >
                      Edit Profile
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">First Name:</p>
                      <p className="text-sm text-gray-900">{profile.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Last Name:</p>
                      <p className="text-sm text-gray-900">{profile.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email:</p>
                      <p className="text-sm text-gray-900">{jwtEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone:</p>
                      <p className="text-sm text-gray-900">{profile.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">College:</p>
                      <p className="text-sm text-gray-900">{profile.college}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Course:</p>
                      <p className="text-sm text-gray-900">{profile.course}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Year of Study:</p>
                      <p className="text-sm text-gray-900">{profile.yearOfStudy}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">GPA:</p>
                      <p className="text-sm text-gray-900">{profile.gpa}</p>
                    </div>
                  </div>
                </div>
                {/* Documents Section */}
                <div className="relative mb-8">
                  <div className="flex items-center justify-between mb-4 border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                    <button
                      className="px-4 py-1 rounded border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 font-medium text-sm shadow-sm transition-all duration-150"
                      style={{ minWidth: 120 }}
                      onClick={() => { setShowApplyModal(false); setActiveTab('documents'); }}
                    >
                      Edit Documents
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Resume:</p>
                      {uploadedDocuments.documents.filter((d: any) => d.type === 'resume').length > 0 ? (
                        uploadedDocuments.documents.filter((d: any) => d.type === 'resume').map((doc: any) => (
                          <div key={doc.id} className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">{doc.fileName}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">Not uploaded</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Marksheet:</p>
                      {uploadedDocuments.documents.filter((d: any) => d.type === 'marksheet').length > 0 ? (
                        uploadedDocuments.documents.filter((d: any) => d.type === 'marksheet').map((doc: any) => (
                          <div key={doc.id} className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">{doc.fileName}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">Not uploaded</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Identity Proof:</p>
                      {uploadedDocuments.documents.filter((d: any) => d.type === 'identity_proof').length > 0 ? (
                        uploadedDocuments.documents.filter((d: any) => d.type === 'identity_proof').map((doc: any) => (
                          <div key={doc.id} className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">{doc.fileName}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">Not uploaded</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Certificates:</p>
                      {uploadedDocuments.certificates.length > 0 ? (
                        uploadedDocuments.certificates.map((cert: any) => (
                          <div key={cert.id} className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">{cert.certificateName}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Recruiter Question Section (if present) */}
              {applyJob.questionForApplicant && (
                <div className="mb-6">
                  <div className="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-900 text-base font-medium mb-2">
                    {applyJob.questionForApplicant}
                  </div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Your Answer</label>
                  <div className="relative">
                    <textarea
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
                      placeholder="Your answer..."
                      value={applicantAnswer}
                      onChange={(e) => setApplicantAnswer(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={applyLoading || (applyJob.questionForApplicant && !applicantAnswer.trim())}
                  onClick={handleSubmitApplication}
                >
                  {applyLoading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <MessageModal
        applicationId={chatAppId ?? 0}
        receiverEmail={chatReceiverEmail}
        receiverRole={chatReceiverRole}
        isOpen={chatAppId !== null}
        onClose={() => setChatAppId(null)}
        currentUserEmail={jwtEmail}
        currentUserRole={'STUDENT'}
      />
      {showJobDetailsModal && jobDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-none shadow-xl w-full h-full p-0 border-0 animate-in fade-in-from-bottom duration-300 flex flex-col">
            <div className="flex justify-between items-center px-8 py-6 border-b">
              <div className="text-2xl font-bold text-gray-900">Job Details</div>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowJobDetailsModal(false)}
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-0 py-0 flex flex-col pb-12">
              <div className="flex flex-col md:flex-row h-full w-full">
                {/* Left: Job Description */}
                <div className="flex-1 flex flex-col items-start px-12 py-12 border-r border-gray-200 min-h-0 pt-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-0">{jobDetails.title}</h2>
                  <div className="mb-2 text-xl text-gray-700 font-medium">
                    {jobDetails.companyName || jobDetails.company || (jobDetails.recruiter && jobDetails.recruiter.company) || ''}
                  </div>
                  <h3 className="text-xl font-bold text-blue-700 mb-2 mt-0">Job Description</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded px-4 py-4 text-gray-900 text-base whitespace-pre-line w-full mb-4">
                    {jobDetails.description}
                  </div>
                </div>
                {/* Right: Skills */}
                <div className="flex-1 flex flex-col items-start px-12 py-12 min-h-0 pt-8">
                  <h3 className="text-xl font-bold text-blue-700 mb-2 mt-0">Required Skills</h3>
                  {jobDetails.requirements ? (
                    <ul className="list-disc ml-6 space-y-2 text-lg mb-4">
                      {jobDetails.requirements.split(',').map((skill: string, idx: number) => (
                        <li key={idx} className="text-gray-700">{skill.trim()}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 mb-4">No skills listed.</div>
                  )}
                  <div className="flex justify-end w-full mt-12">
                    <button
                      className="px-8 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-lg"
                      onClick={() => { setShowJobDetailsModal(false); setApplyJob(jobDetails); setShowApplyModal(true); }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}