// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Auth API
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Refresh token
  refreshToken: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Logout
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData)
    });
    return handleResponse(response);
  }
};

// Users API
export const usersAPI = {
  // Get user profile
  getProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Get user statistics
  getUserStats: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get all users (admin only)
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/users?${queryString}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Documents API
export const documentsAPI = {
  // Create document from Google Drive link
  createFromLink: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/documents/link`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },
  // Upload documents
  uploadDocuments: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return handleResponse(response);
  },

  // Get user's documents
  getDocuments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/documents?${queryString}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get document by ID
  getDocument: async (documentId) => {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update document
  updateDocument: async (documentId, documentData) => {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(documentData)
    });
    return handleResponse(response);
  },

  // Delete document
  deleteDocument: async (documentId) => {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Download document
  downloadDocument: async (documentId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/download`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Download failed' }));
      throw new Error(errorData.message || 'Download failed');
    }
    
    return response.blob();
  },

  // Process document
  processDocument: async (documentId) => {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/process`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get document statistics
  getDocumentStats: async () => {
    const response = await fetch(`${API_BASE_URL}/documents/stats/overview`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Question Papers API
export const papersAPI = {
  // Create question paper
  createPaper: async (paperData) => {
    const response = await fetch(`${API_BASE_URL}/papers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paperData)
    });
    return handleResponse(response);
  },

  // Get user's question papers
  getPapers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/papers?${queryString}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get question paper by ID
  getPaper: async (paperId) => {
    const response = await fetch(`${API_BASE_URL}/papers/${paperId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Update question paper
  updatePaper: async (paperId, paperData) => {
    const response = await fetch(`${API_BASE_URL}/papers/${paperId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(paperData)
    });
    return handleResponse(response);
  },

  // Delete question paper
  deletePaper: async (paperId) => {
    const response = await fetch(`${API_BASE_URL}/papers/${paperId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Add questions to section
  addQuestionsToSection: async (paperId, sectionData) => {
    const response = await fetch(`${API_BASE_URL}/papers/${paperId}/questions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(sectionData)
    });
    return handleResponse(response);
  },

  // Remove question from section
  removeQuestionFromSection: async (paperId, questionId, sectionIndex) => {
    const response = await fetch(`${API_BASE_URL}/papers/${paperId}/questions/${questionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ sectionIndex })
    });
    return handleResponse(response);
  },

  // Generate questions using AI
  generateQuestions: async (paperId, generationData) => {
    const response = await fetch(`${API_BASE_URL}/papers/${paperId}/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(generationData)
    });
    return handleResponse(response);
  },

  // Add review comment
  addReviewComment: async (paperId, comment) => {
    const response = await fetch(`${API_BASE_URL}/papers/${paperId}/review`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ comment })
    });
    return handleResponse(response);
  },

  // Update paper status
  updatePaperStatus: async (paperId, status) => {
    const response = await fetch(`${API_BASE_URL}/papers/${paperId}/status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // Get paper statistics
  getPaperStats: async () => {
    const response = await fetch(`${API_BASE_URL}/papers/stats/overview`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Upload API
export const uploadAPI = {
  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/avatar`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return handleResponse(response);
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  }
};

export default {
  authAPI,
  usersAPI,
  documentsAPI,
  papersAPI,
  uploadAPI,
  healthAPI
};
