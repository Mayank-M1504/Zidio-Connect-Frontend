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
    console.log("API: createOrUpdateStudentProfile called with:", { profileData, profilePictureFile, resumeFile });
    console.log("API: profilePictureFile type:", typeof profilePictureFile);
    console.log("API: resumeFile type:", typeof resumeFile);
    console.log("API: profilePictureFile is null:", profilePictureFile === null);
    console.log("API: resumeFile is null:", resumeFile === null);
    console.log("API: profilePictureFile is undefined:", profilePictureFile === undefined);
    console.log("API: resumeFile is undefined:", resumeFile === undefined);
    
    // Check if we have actual files to upload
    const hasProfilePicture = profilePictureFile && profilePictureFile instanceof File && profilePictureFile.size > 0;
    const hasResume = resumeFile && resumeFile instanceof File && resumeFile.size > 0;
    
    console.log("API: hasProfilePicture:", hasProfilePicture);
    console.log("API: hasResume:", hasResume);
    
    if (hasProfilePicture || hasResume) {
      console.log("API: Using FormData path");
      // Use FormData for file upload
    const formData = new FormData();
    formData.append('profileData', JSON.stringify(profileData));
      if (hasProfilePicture) {
      formData.append('profilePicture', profilePictureFile);
    }
      if (hasResume) {
      formData.append('resume', resumeFile);
    }
      console.log("API: Sending FormData request");
    const response = await api.post('/api/student/profile', formData);
      console.log("API: FormData response received:", response.data);
      return response.data;
    } else {
      console.log("API: Using JSON path");
      // Use JSON for data-only update
      console.log("API: Sending JSON request with data:", profileData);
      
      // Clean the data to remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries(profileData).filter(([_, value]) => value !== undefined)
      );
      
      console.log("API: Cleaned data:", cleanData);
      
      const response = await api.post('/api/student/profile/json', cleanData, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log("API: JSON response received:", response.data);
    return response.data;
    }
  } catch (error: any) {
    console.error("API: Error in createOrUpdateStudentProfile:", error);
    console.error("API: Error response:", error.response?.data);
    console.error("API: Error status:", error.response?.status);
    throw handleProfileApiError(error);
  }
};

// 2. Get Current Student Profile
export const getCurrentStudentProfile = async (): Promise<StudentProfileData> => {
  try {
    const response = await api.get('/api/student/profile');
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