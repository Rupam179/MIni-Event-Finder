import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const eventAPI = {
  // Get all events with optional filters
  getEvents: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.search) params.append('search', filters.search);
    
    const response = await api.get(`/events?${params}`);
    return response.data;
  },

  // Get single event by ID
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create new event
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Join an event
  joinEvent: async (id) => {
    const response = await api.put(`/events/${id}/join`);
    return response.data;
  },

  // Delete an event
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;