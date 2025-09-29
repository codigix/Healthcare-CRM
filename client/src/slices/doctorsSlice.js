import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doctorsAPI } from '../services/api';

// Async thunks
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorsAPI.getDoctors();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctors');
    }
  }
);

export const fetchDoctor = createAsyncThunk(
  'doctors/fetchDoctor',
  async (id, { rejectWithValue }) => {
    try {
      const response = await doctorsAPI.getDoctor(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctor');
    }
  }
);

export const createDoctor = createAsyncThunk(
  'doctors/createDoctor',
  async (doctorData, { rejectWithValue }) => {
    try {
      const response = await doctorsAPI.createDoctor(doctorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create doctor');
    }
  }
);

export const updateDoctor = createAsyncThunk(
  'doctors/updateDoctor',
  async ({ id, doctorData }, { rejectWithValue }) => {
    try {
      const response = await doctorsAPI.updateDoctor(id, doctorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update doctor');
    }
  }
);

export const fetchDoctorStats = createAsyncThunk(
  'doctors/fetchDoctorStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorsAPI.getDoctorStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctor statistics');
    }
  }
);

const initialState = {
  doctors: [],
  currentDoctor: null,
  stats: null,
  isLoading: false,
  error: null,
};

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDoctor: (state) => {
      state.currentDoctor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Doctor
      .addCase(fetchDoctor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDoctor = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Doctor
      .addCase(createDoctor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Doctor
      .addCase(updateDoctor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Update doctor in the list if it exists
        const index = state.doctors.findIndex(doctor => doctor.id === action.payload.id);
        if (index !== -1) {
          state.doctors[index] = { ...state.doctors[index], ...action.payload };
        }
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Doctor Stats
      .addCase(fetchDoctorStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctorStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctorStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentDoctor } = doctorsSlice.actions;
export default doctorsSlice.reducer;
