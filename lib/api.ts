import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    // Do not set Content-Type globally; let axios handle it for FormData
    // Remove withCredentials: true (not needed for Authorization header)
});

// Attach JWT from localStorage as Bearer token in Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface BaseRegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface StudentRegisterRequest extends BaseRegisterRequest {
    role: 'STUDENT';
    college: string;
}

export interface RecruiterRegisterRequest extends BaseRegisterRequest {
    role: 'RECRUITER';
    company: string;
}

export type RegisterRequest = StudentRegisterRequest | RecruiterRegisterRequest;

export interface LoginRequest {
    email: string;
    password: string;
    role: 'STUDENT' | 'RECRUITER';
}

export interface AuthResponse {
    token: string;
    message: string;
}

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
        console.log('Sending registration request:', JSON.stringify(data, null, 2));
        const response = await api.post('/api/auth/register', data);
        console.log('Registration response:', response.data);
        return response.data;
    } catch (error: any) {
        // Log the complete error response for debugging
        console.error('Full error response:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
        });

        if (error.response) {
            // The server sends the error message as a string in the data field
            const errorMessage = error.response.data;
            console.log('Server error message:', errorMessage);

            // Extract the specific error message from the string
            if (typeof errorMessage === 'string') {
                if (errorMessage.includes('Email already registered')) {
                    throw new Error('This email is already registered. Please use a different email or try logging in.');
                }
                // Add more specific error message handling here if needed
                throw new Error(errorMessage);
            }

            // If no specific message, use a generic one
            throw new Error('Registration failed. Please try again.');
        } else if (error.request) {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    try {
        console.log('Sending login request:', JSON.stringify(data, null, 2));
        const response = await api.post('/api/auth/login', data);
        console.log('Login response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Login error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
        });

        if (error.response) {
            const errorMessage = error.response.data;
            console.log('Server error message:', errorMessage);

            if (typeof errorMessage === 'string') {
                if (errorMessage.toLowerCase().includes('invalid credentials')) {
                    throw new Error('Invalid email or password. Please try again.');
                }
                throw new Error(errorMessage);
            }
            throw new Error('Login failed. Please try again.');
        } else if (error.request) {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

// Student Profile Data Structure
export interface StudentProfileData {
  // Basic Information
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profilePicture?: string | null; // URL
  college?: string;

  // Academic Information
  course?: string;
  currentYear?: number;
  gpa?: string;
  expectedGraduationDate?: string;
  academicAchievements?: string;

  // Professional Information
  skills?: string[];
  resume?: string | null; // URL
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;

  // Personal Information
  dateOfBirth?: string;
  address?: string;
  bio?: string;
  interests?: string[];

  // Career Information
  careerGoals?: string;
  preferredJobRoles?: string[];
  preferredLocations?: string[];
  workAuthorizationStatus?: string;
}

export interface RecruiterProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  companyWebsite?: string;
  companyAddress?: string;
  companyDescription?: string;
  recruiterRole?: string;
  linkedinProfile?: string;
  stinNumber?: string;
}

export const getCurrentRecruiterProfile = async (): Promise<RecruiterProfileData> => {
  try {
    const response = await api.get('/api/recruiter/profile');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return {};
    }
    throw error;
  }
};

export const updateRecruiterProfile = async (profileData: RecruiterProfileData): Promise<RecruiterProfileData> => {
  const response = await api.post('/api/recruiter/profile', profileData, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  return response.data;
};

// Test function to verify JSON communication
export const testJsonCommunication = async (): Promise<any> => {
  try {
    const testData = { test: "data", number: 123 };
    console.log("Testing JSON communication with:", testData);
    const response = await api.post('/api/test/test-json', testData, {
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log("Test JSON response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Test JSON error:", error);
    throw error;
  }
};

// 1. Create or Update Student Profile
export const createOrUpdateStudentProfile = async (
  profileData: StudentProfileData,
  profilePictureFile?: File | null,
  resumeFile?: File | null
): Promise<StudentProfileData> => {
  try {
    // Only JSON path is needed for now
    const cleanData = Object.fromEntries(
      Object.entries(profileData).filter(([_, value]) => value !== undefined)
    );
    const response = await api.post('/api/profile', cleanData, {
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    throw handleProfileApiError(error);
  }
};

// 2. Get Current Student Profile
export const getCurrentStudentProfile = async (): Promise<StudentProfileData> => {
  try {
    const response = await api.get('/api/profile');
    return response.data;
  } catch (error: any) {
    throw handleProfileApiError(error);
  }
};

// 3. Get Profile by User ID (for recruiters/admins)
export const getStudentProfileByUserId = async (userId: string): Promise<StudentProfileData> => {
  try {
    const response = await api.get(`/api/student/profile/${userId}`);
    return response.data;
  } catch (error: any) {
    throw handleProfileApiError(error);
  }
};

// 4. Delete Student Profile
export const deleteStudentProfile = async (): Promise<{ message: string }> => {
  try {
    const response = await api.delete('/api/student/profile');
    return response.data;
  } catch (error: any) {
    throw handleProfileApiError(error);
  }
};

// 5. Update Only Profile Picture
export const updateStudentProfilePicture = async (profilePictureFile: File): Promise<{ profilePicture: string }> => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', profilePictureFile);
    const response = await api.put('/api/student/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    throw handleProfileApiError(error);
  }
};

// 6. Update Only Resume
export const updateStudentResume = async (resumeFile: File): Promise<{ resume: string }> => {
  try {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    const response = await api.put('/api/student/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    throw handleProfileApiError(error);
  }
};

// --- Error Handling Helper ---
function handleProfileApiError(error: any): Error {
  if (error.response) {
    const errorMessage = error.response.data;
    if (typeof errorMessage === 'string') {
      return new Error(errorMessage);
    }
    if (typeof errorMessage === 'object' && errorMessage !== null) {
      if (errorMessage.message) return new Error(errorMessage.message);
      if (errorMessage.error) return new Error(errorMessage.error);
      return new Error(JSON.stringify(errorMessage));
    }
    return new Error('Profile API error. Please try again.');
  } else if (error.request) {
    return new Error('Unable to connect to the server. Please check your internet connection.');
  } else {
    return new Error('An unexpected error occurred. Please try again.');
  }
} 

export const uploadStudentDocument = async (
  file: File,
  type: string
): Promise<any> => {
  console.log("=== API Upload Debug ===");
  console.log("Uploading file:", file.name);
  console.log("File type:", file.type);
  console.log("File size:", file.size);
  console.log("Document type:", type);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  console.log("FormData created, sending request...");
  
  try {
    const response = await api.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log("Upload response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Upload error:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const uploadStudentCertificate = async (
  file: File,
  certificateName: string
): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('certificateName', certificateName);
  const response = await api.post('/api/documents/certificates/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getStudentDocuments = async (): Promise<any> => {
  try {
    const response = await api.get('/api/documents/student/list');
    return response.data;
  } catch (error: any) {
    console.error("getStudentDocuments error:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const getStudentDocumentsByType = async (type: string): Promise<any> => {
  const response = await api.get(`/api/documents/type/${type}`);
  return response.data;
};

export const deleteStudentDocument = async (documentId: number): Promise<any> => {
  const response = await api.delete(`/api/documents/${documentId}`);
  return response.data;
};

export const deleteStudentCertificate = async (certificateId: number): Promise<any> => {
  const response = await api.delete(`/api/documents/certificates/${certificateId}`);
  return response.data;
};

export const getAllAdminDocuments = async (): Promise<any[]> => {
  console.log("Calling getAllAdminDocuments API...");
  try {
    const response = await api.get('/api/documents/admin/all-documents');
    console.log("getAllAdminDocuments response:", response.data);
    console.log("Response type:", typeof response.data);
    console.log("Is array:", Array.isArray(response.data));
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error("getAllAdminDocuments error:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const getAllAdminCertificates = async (): Promise<any[]> => {
  console.log("Calling getAllAdminCertificates API...");
  try {
    const response = await api.get('/api/documents/admin/all-certificates');
    console.log("getAllAdminCertificates response:", response.data);
    console.log("Response type:", typeof response.data);
    console.log("Is array:", Array.isArray(response.data));
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error("getAllAdminCertificates error:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const updateDocumentStatus = async (documentId: number, status: string): Promise<any> => {
  const response = await api.patch(`/api/documents/admin/document-status/${documentId}?status=${status}`);
  return response.data;
};

export const updateCertificateStatus = async (certificateId: number, status: string): Promise<any> => {
  const response = await api.patch(`/api/documents/admin/certificate-status/${certificateId}?status=${status}`);
  return response.data;
};

export const testDatabaseState = async (): Promise<any> => {
  console.log("Calling test database state API...");
  try {
    const response = await api.get('/api/documents/test/db-state');
    console.log("Test database state response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Test database state error:", error);
    throw error;
  }
};

export const getRecruiterDocuments = async (): Promise<any[]> => {
  try {
    const response = await api.get('/api/recruiter/profile/documents');
    return response.data;
  } catch (error: any) {
    console.error('getRecruiterDocuments error:', error);
    throw error;
  }
};

export const getRecruiterDocumentById = async (id: number): Promise<any | null> => {
  try {
    const response = await api.get(`/api/recruiter/document/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null; // No document found
    }
    console.error('getRecruiterDocumentById error:', error);
    throw error;
  }
};

export const deleteRecruiterDocument = async (documentId: number): Promise<any> => {
  const response = await api.delete(`/api/recruiter/profile/document/${documentId}`);
  return response.data;
};