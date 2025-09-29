import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { patientsAPI } from '../services/api';

// Async thunks
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (params, { rejectWithValue }) => {
    try {
      const response = await patientsAPI.getPatients(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients');
    }
  }
);

export const fetchPatient = createAsyncThunk(
  'patients/fetchPatient',
  async (id, { rejectWithValue }) => {
    try {
      const response = await patientsAPI.getPatient(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient');
    }
  }
);

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData, { rejectWithValue }) => {
    try {
      const response = await patientsAPI.createPatient(patientData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create patient');
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, patientData }, { rejectWithValue }) => {
    try {
      const response = await patientsAPI.updatePatient(id, patientData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update patient');
    }
  }
);

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id, { rejectWithValue }) => {
    try {
      await patientsAPI.deletePatient(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete patient');
    }
  }
);

export const fetchPatientStats = createAsyncThunk(
  'patients/fetchPatientStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientsAPI.getPatientStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient statistics');
    }
  }
);

const initialState = {
  patients: [],
  currentPatient: null,
  stats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  isLoading: false,
  error: null,
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Patients
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload.patients;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Patient
      .addCase(fetchPatient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPatient = action.payload;
        state.error = null;
      })
      .addCase(fetchPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Patient
      .addCase(createPatient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Patient
      .addCase(updatePatient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Update patient in the list if it exists
        const index = state.patients.findIndex(patient => patient.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = { ...state.patients[index], ...action.payload };
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete Patient
      .addCase(deletePatient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = state.patients.filter(patient => patient.id !== action.payload);
        state.error = null;
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Patient Stats
      .addCase(fetchPatientStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchPatientStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPatient, setSearchQuery } = patientsSlice.actions;
export default patientsSlice.reducer;
