import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Get all leads
export const getLeads = createAsyncThunk(
  'leads/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/leads');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single lead
export const getLead = createAsyncThunk(
  'leads/getOne',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/leads/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create lead
export const createLead = createAsyncThunk(
  'leads/create',
  async (leadData, thunkAPI) => {
    try {
      const response = await api.post('/leads', leadData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update lead
export const updateLead = createAsyncThunk(
  'leads/update',
  async ({ id, leadData }, thunkAPI) => {
    try {
      const response = await api.put(`/leads/${id}`, leadData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete lead
export const deleteLead = createAsyncThunk(
  'leads/delete',
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/leads/${id}`);
      return { id, ...response.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  leads: [],
  currentLead: null,
  isError: false,
  isSuccess: false,
  isCreateSuccess: false,
  isDeleteSuccess: false,
  isLoading: false,
  message: '',
};

export const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    resetLeads: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isCreateSuccess = false;
      state.isDeleteSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLeads.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.leads = action.payload.leads || [];
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedLead = action.payload.lead;
        state.leads = state.leads.map((lead) => 
          lead._id === updatedLead._id ? updatedLead : lead
        );
        if (state.currentLead && state.currentLead._id === updatedLead._id) {
          state.currentLead = updatedLead;
        }
      })
      .addCase(getLead.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentLead = action.payload.lead;
      })
      .addCase(getLead.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createLead.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreateSuccess = true;
        if (action.payload.lead) {
          state.leads = [action.payload.lead, ...state.leads];
        }
      })
      .addCase(createLead.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteLead.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDeleteSuccess = true;
        state.leads = state.leads.filter((lead) => lead._id !== action.payload.id);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetLeads } = leadSlice.actions;
export default leadSlice.reducer;
