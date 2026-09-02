import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';
import Backend_URL from '../../server';
const API_URL = `${Backend_URL}/api/v1/dashboard`;


// Async thunk for getting all user profiles
export const getAllUserProfiles = createAsyncThunk(
  'dashboard/getAllUserProfiles',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.techStack) params.append('techStack', filters.techStack);
      if (filters.experience) params.append('experience', filters.experience);

      const response = await api.get(`${API_URL}/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load user profiles'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    profiles: [],
    loading: false,
    error: null,
    totalUsers: 0,
    filters: {
      techStack: 'All',
      experience: 'All'
    }
  },
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    clearProfiles: (state) => {
      state.profiles = [];
      state.totalUsers = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUserProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUserProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload.data.users;
        state.totalUsers = action.payload.data.totalUsers;
        state.filters = action.payload.data.filters;
        state.error = null;
      })
      .addCase(getAllUserProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profiles = [];
        state.totalUsers = 0;
      });
  }
});

export const { clearDashboardError, clearProfiles } = dashboardSlice.actions;
export default dashboardSlice.reducer;