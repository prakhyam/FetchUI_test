import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// here I am sending Post request to auth/login endpoint, it receives an auth cookie from server and returns the response.data
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

// Here I am sending GET request to /dogs/breeds and gets list of all available dog breed names, returns the list
export const getBreeds = async () => {
  try {
    const response = await api.get('/dogs/breeds');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// here sending GET request to /dogs/search
export const searchDogs = async (params) => {
  try {
    const response = await api.get('/dogs/search', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//here POST request for /dogs, with list of Dog IDs
export const getDogs = async (dogIds) => {
  try {
    const response = await api.post('/dogs', dogIds);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//here,a POST request to /dogs/match, gives a favourites list

export const getMatch = async (dogIds) => {
  try {
    const response = await api.post('/dogs/match', dogIds);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// here, POST request to /locations api, gives list of Zip codes
export const getLocations = async (zipCodes) => {
  try {
    const response = await api.post('/locations', zipCodes);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchLocations = async (params) => {
  try {
    const response = await api.post('/locations/search', params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;