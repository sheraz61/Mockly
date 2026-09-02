import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';
import Backend_URL from '../../server';

const API_URL = `${Backend_URL}/api/v1/user`;

// Get user's own profile
export const getMyProfile = createAsyncThunk(
  'profile/getMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`${API_URL}/my-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load profile'
      );
    }
  }
);

// Get specific user's public profile
export const getUserProfile = createAsyncThunk(
  'profile/getUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/profile/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load user profile'
      );
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`${API_URL}/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

// Get User Analytics
export const getUserAnalytics = createAsyncThunk(
  'profile/getUserAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/v1/interview/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load analytics'
      );
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    myProfile: null,
    userProfile: null,
    interviews: [],
    analytics: null,
    loading: false,
    analyticsLoading: false,
    updating: false,
    error: null
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearUserProfile: (state) => {
      state.userProfile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get My Profile
      .addCase(getMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload.data.user;
        state.interviews = action.payload.data.interviews || [];
        state.error = null;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload.data.user;
        state.interviews = action.payload.data.interviews || [];
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.myProfile = action.payload.data;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Get User Analytics
      .addCase(getUserAnalytics.pending, (state) => {
        state.analyticsLoading = true;
      })
      .addCase(getUserAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload.data;
      })
      .addCase(getUserAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearProfileError, clearUserProfile } = profileSlice.actions;
export default profileSlice.reducer;