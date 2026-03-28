import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Get all audit logs
export const getAuditLogs = createAsyncThunk(
  'audit/getAll',
  async (filters, thunkAPI) => {
    try {
      const response = await api.get('/audit-logs', { params: filters });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  logs: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    resetAudit: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuditLogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAuditLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.logs = action.payload.logs;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAuditLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetAudit } = auditSlice.actions;
export default auditSlice.reducer;
