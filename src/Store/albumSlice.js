// src/redux/albumSlice.js
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
    } catch  {
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
    },
    reducers: {},
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
          // If you still need to store an error message, add it here
          state.error = action.payload; // or any custom error handling you wish
        });
    },
  });

export default albumSlice.reducer;
