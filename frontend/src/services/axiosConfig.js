import axios from 'axios';
import { supabase } from './supabaseClient';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(async (config) => {
  try {
    console.log('Getting session from Supabase...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      console.log('Adding auth token to request');
      config.headers.Authorization = `Bearer ${session.access_token}`;
    } else {
      console.log('No session found');
    }
    
    return config;
  } catch (error) {
    console.error('Error in axios interceptor:', error);
    return config;
  }
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default axiosInstance; 