import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aiAPI } from '../services/api';

// Async thunks
export const generateReport = createAsyncThunk(
  'reports/generateReport',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await aiAPI.generateReport(reportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate report');
    }
  }
);

export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (params, { rejectWithValue }) => {
    try {
      const response = await aiAPI.getReports(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
    }
  }
);

export const fetchReport = createAsyncThunk(
  'reports/fetchReport',
  async (id, { rejectWithValue }) => {
    try {
      const response = await aiAPI.getReport(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report');
    }
  }
);

export const deleteReport = createAsyncThunk(
  'reports/deleteReport',
  async (id, { rejectWithValue }) => {
    try {
      await aiAPI.deleteReport(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete report');
    }
  }
);

export const chatWithAI = createAsyncThunk(
  'reports/chatWithAI',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await aiAPI.chat(messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to chat with AI');
    }
  }
);

const initialState = {
  reports: [],
  currentReport: null,
  aiChatHistory: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  isLoading: false,
  isGeneratingReport: false,
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
    addChatMessage: (state, action) => {
      state.aiChatHistory.push(action.payload);
    },
    clearChatHistory: (state) => {
      state.aiChatHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Report
      .addCase(generateReport.pending, (state) => {
        state.isGeneratingReport = true;
        state.error = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.isGeneratingReport = false;
        state.reports.unshift(action.payload.report);
        state.error = null;
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.isGeneratingReport = false;
        state.error = action.payload;
      })
      
      // Fetch Reports
      .addCase(fetchReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload.reports;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Report
      .addCase(fetchReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReport = action.payload;
        state.error = null;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete Report
      .addCase(deleteReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = state.reports.filter(report => report.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Chat with AI
      .addCase(chatWithAI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(chatWithAI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.aiChatHistory.push({
          type: 'ai',
          message: action.payload.response,
          timestamp: new Date().toISOString()
        });
        state.error = null;
      })
      .addCase(chatWithAI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentReport, addChatMessage, clearChatHistory } = reportsSlice.actions;
export default reportsSlice.reducer;
