import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Get all properties
export const getProperties = createAsyncThunk(
  'properties/getAll',
  async (search = '', thunkAPI) => {
    try {
      const response = await api.get(`/properties${search ? `?search=${search}` : ''}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create property
export const createProperty = createAsyncThunk(
  'properties/create',
  async (propertyData, thunkAPI) => {
    try {
      const response = await api.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  properties: [],
  isError: false,
  isSuccess: false,
  isCreateSuccess: false,
  isLoading: false,
  message: '',
};

export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    resetProperties: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isCreateSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = action.payload.properties || [];
      })
      .addCase(getProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreateSuccess = true;
        if (action.payload.property) {
          state.properties = [action.payload.property, ...state.properties];
        }
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetProperties } = propertySlice.actions;
export default propertySlice.reducer;
