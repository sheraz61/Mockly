import axios from 'axios';
import Backend_URL from '../server';

const api = axios.create({
  baseURL: Backend_URL,
  withCredentials: true // Important: This ensures cookies are sent with every request
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 Unauthorized, and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        // We use plain axios here to avoid interceptor loops if refresh fails
        await axios.get(`${Backend_URL}/api/v1/user/refresh`, {
          withCredentials: true
        });
        
        // If successful, the new secure cookies are automatically set by the browser.
        // We can now retry the original request.
        return api(originalRequest);
        
      } catch (refreshError) {
        // If refresh fails (e.g. refresh token expired), clear local data and redirect
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // For all other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default api;
