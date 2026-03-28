import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import leadReducer from '../features/leads/leadSlice';
import activityReducer from '../features/activities/activitySlice';
import auditReducer from '../features/audit/auditSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadReducer,
    activities: activityReducer,
    audit: auditReducer,
  },
});
