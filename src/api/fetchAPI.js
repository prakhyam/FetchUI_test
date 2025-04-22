import axios from 'axios';

// the base URL for the API. If an environment variable isn't set, we default to the given Fetch API.
const API_URL = process.env.REACT_APP_API_URL || 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, //for cookie handling
});


// it just logs every API request to the console, useful during deployment
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  response => {
    return response;  //just return the response, if it works fine
  },
  error => {
    if (error.response) {
      console.error('API Error Response:', error.response.status, error.response.data);
      
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


// Auth APIs
export const login = async (name, email) => {
  try {
    const response = await api.post('/auth/login', { name, email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Dog APIs
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


// Location APIs
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
    const defaultResponse = { results: [], total: 0 };
    
    if (params.states && params.states.length === 0) {
      delete params.states;
    }
    
    if (params.zipCodes && params.zipCodes.length === 0) {
      delete params.zipCodes;
    }
    
    if (!params.size || params.size < 20) {
      params.size = 50; 
    }
    
    if (Object.keys(params).length === 1 && params.size) {
      params.states = ['CA', 'TX', 'NY', 'FL'];
    }
    
    const response = await api.post('/locations/search', params);
    
    if (response && response.data) {
      return response.data;
    }
    
    return defaultResponse;
  } catch (error) {
    console.error('Error searching locations:', error);
    return { results: [], total: 0 };
  }
};

export default api;