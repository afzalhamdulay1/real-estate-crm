import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const API_URL = '/dashboard';

export const getDashboardStats = createAsyncThunk(
  'dashboard/getStats',
  async (params = {}, thunkAPI) => {
    try {
      const response = await api.get(`${API_URL}/stats`, { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTrajectoryOnly = createAsyncThunk(
  'dashboard/getTrajectory',
  async (params = {}, thunkAPI) => {
    try {
      const response = await api.get(`${API_URL}/trajectory`, { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    recentActivities: [],
    topProperty: null,
    trajectoryData: [],
    inventoryTrajectory: [],
    leadStatusData: [],
    propertyTypeData: [],
    revenueTrajectoryData: [],
    isLoading: false,
    isChartLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload.stats;
        state.recentActivities = action.payload.recentActivities;
        state.topProperty = action.payload.topProperty;
        state.trajectoryData = action.payload.trajectoryData;
        state.revenueTrajectoryData = action.payload.trajectoryData;
        state.inventoryTrajectory = action.payload.inventoryTrajectory;
        state.leadStatusData = action.payload.leadStatusData;
        state.propertyTypeData = action.payload.propertyTypeData;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTrajectoryOnly.pending, (state) => {
        state.isChartLoading = true;
      })
      .addCase(getTrajectoryOnly.fulfilled, (state, action) => {
        state.isChartLoading = false;
        state.revenueTrajectoryData = action.payload.trajectoryData;
      })
      .addCase(getTrajectoryOnly.rejected, (state) => {
        state.isChartLoading = false;
      });
  },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;
