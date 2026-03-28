import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Get all activities
export const getActivities = createAsyncThunk(
  'activities/getAll',
  async (filters, thunkAPI) => {
    try {
      const response = await api.get('/activities', { params: filters });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create activity
export const createActivity = createAsyncThunk(
  'activities/create',
  async (activityData, thunkAPI) => {
    try {
      const response = await api.post('/activities', activityData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  activities: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isError: false,
  isSuccess: false,
  isCreateSuccess: false,
  isLoading: false,
  message: '',
};

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    resetActivities: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isCreateSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActivities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActivities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.activities = action.payload.activities;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getActivities.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createActivity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreateSuccess = true;
        if (action.payload.activity) {
          state.activities = [action.payload.activity, ...state.activities];
        }
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetActivities } = activitySlice.actions;
export default activitySlice.reducer;
