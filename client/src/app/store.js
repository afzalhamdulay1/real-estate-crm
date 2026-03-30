import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import leadReducer from '../features/leads/leadSlice';
import activityReducer from '../features/activities/activitySlice';
import auditReducer from '../features/audit/auditSlice';
import propertyReducer from '../features/properties/propertySlice';
import userReducer from '../features/users/userSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadReducer,
    activities: activityReducer,
    audit: auditReducer,
    properties: propertyReducer,
    users: userReducer,
    dashboard: dashboardReducer,
  },
});
