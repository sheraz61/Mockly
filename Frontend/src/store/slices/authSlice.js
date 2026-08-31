import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';
import Backend_URL from '../../server';
const API_URL=`${Backend_URL}/api/v1/user`


// Async thunk for LOGIN
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

// Async thunk for REGISTRATION
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/register`, {
        name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

// Async thunk for OTP verification / Activate User
export const verifyOTP = createAsyncThunk(
  'auth/verify',
  async ({ activationToken, activationCode }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/activate-user`, {
        activationToken,
        activationCode
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'OTP verification failed'
      );
    }
  }
);



// Async thunk for LOGOUT
export const logoutUser = createAsyncThunk(
  'auth/logoutAPI',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/logout`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    pendingEmail: null,
    activationToken: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.pendingEmail = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    setPendingEmail: (state, action) => {
      state.pendingEmail = action.payload;
    },
    clearPendingEmail: (state) => {
      state.pendingEmail = null;
      state.activationToken = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      
      // REGISTRATION cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.activationToken = action.payload.activationToken;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // OTP Verification cases - UPDATED for email verification
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.pendingEmail = null;
        state.error = null;
        
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  logout, 
  clearError, 
  setPendingEmail, 
  clearPendingEmail
} = authSlice.actions;

export default authSlice.reducer;