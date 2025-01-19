import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch images
export const fetchImages = createAsyncThunk(
  'album/fetchImages',
  async (eventCode, { rejectWithValue }) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.get(`${apiUrl}/image/fetchImages/${eventCode}`);
      return response.data;
    } catch {
      return rejectWithValue('Error fetching images');
    }
  }
);

// Create slice
const albumSlice = createSlice({
  name: 'album',
  initialState: {
    images: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearImages: (state) => {
      state.images = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.images = action.payload;
        state.loading = false;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearImages } = albumSlice.actions;

export default albumSlice.reducer;
