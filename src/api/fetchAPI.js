import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://frontend-take-home-service.fetch.com';

// Create axios instance with better error handling
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookie handling
});

// Add request interceptor to log requests for debugging
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      // The request was made, but the server responded with an error status
      console.error('API Error Response:', error.response.status, error.response.data);
      
      // If unauthorized and not already on login page, clear user data
      if (error.response.status === 401 && window.location.pathname !== '/login') {
        console.log('Session expired, clearing local user data');
        localStorage.removeItem('user');
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Error Setup:', error.message);
    }
    return Promise.reject(error);
  }
);

export const login = async (name, email) => {
  try {
    const response = await api.post('/auth/login', { name, email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Rest of your API functions remain the same
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBreeds = async () => {
  try {
    const response = await api.get('/dogs/breeds');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchDogs = async (params) => {
  try {
    const response = await api.get('/dogs/search', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDogs = async (dogIds) => {
  try {
    const response = await api.post('/dogs', dogIds);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMatch = async (dogIds) => {
  try {
    const response = await api.post('/dogs/match', dogIds);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLocations = async (zipCodes) => {
  try {
    if (!zipCodes || zipCodes.length === 0) {
      return [];
    }
    const response = await api.post('/locations', zipCodes);
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const searchLocations = async (params) => {
  try {
    // Default empty results structure to ensure consistent returns
    const defaultResponse = { results: [], total: 0 };
    
    // Validate params to avoid API errors
    if (params.states && params.states.length === 0) {
      delete params.states;
    }
    
    if (params.zipCodes && params.zipCodes.length === 0) {
      delete params.zipCodes;
    }
    
    // Make sure we're using a sufficient result size
    if (!params.size || params.size < 20) {
      params.size = 50; // Ensure we get enough results
    }
    
    // For empty search requests, add a minimum search parameter
    if (Object.keys(params).length === 1 && params.size) {
      // Just add some popular states to get results
      params.states = ['CA', 'TX', 'NY', 'FL'];
    }
    
    const response = await api.post('/locations/search', params);
    
    // Ensure we have a valid response with results
    if (response && response.data) {
      return response.data;
    }
    
    return defaultResponse;
  } catch (error) {
    console.error('Error searching locations:', error);
    // Return empty result structure instead of throwing
    return { results: [], total: 0 };
  }
};

export default api;