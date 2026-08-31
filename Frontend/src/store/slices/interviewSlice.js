// store/slices/interviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';
import Backend_URL from '../../server';

const API_URL = `${Backend_URL}/api/v1/interview`;

// Start new interview
export const startInterview = createAsyncThunk(
  'interview/startInterview',
  async (interviewData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`${API_URL}/start`, interviewData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to start interview'
      );
    }
  }
);

// Submit answer - FIXED ENDPOINT
export const submitAnswer = createAsyncThunk(
  'interview/submitAnswer',
  async ({ interviewId, answer }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        `${API_URL}/submit/${interviewId}`, // Changed to match backend
        { answer }, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit answer'
      );
    }
  }
);

// Get results
export const getResults = createAsyncThunk(
  'interview/getResults',
  async (interviewId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`${API_URL}/results/${interviewId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get results'
      );
    }
  }
);

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    loading: false,
    error: null,
    currentInterview: null,
    results: null
  },
  reducers: {
    clearInterviewError: (state) => {
      state.error = null;
    },
    clearCurrentInterview: (state) => {
      state.currentInterview = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInterview = action.payload.data;
        state.error = null;
      })
      .addCase(startInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update current interview data if needed
        if (action.payload.data) {
          state.currentInterview = action.payload.data;
        }
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getResults.fulfilled, (state, action) => {
        state.results = action.payload.data;
      });
  }
});

export const { clearInterviewError, clearCurrentInterview, setError } = interviewSlice.actions;
export default interviewSlice.reducer;