import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../slices/authSlice';
import patientsSlice from '../slices/patientsSlice';
import doctorsSlice from '../slices/doctorsSlice';
import appointmentsSlice from '../slices/appointmentsSlice';
import departmentsSlice from '../slices/departmentsSlice';
import reportsSlice from '../slices/reportsSlice';
import usersSlice from '../slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    patients: patientsSlice,
    doctors: doctorsSlice,
    appointments: appointmentsSlice,
    departments: departmentsSlice,
    reports: reportsSlice,
    users: usersSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
