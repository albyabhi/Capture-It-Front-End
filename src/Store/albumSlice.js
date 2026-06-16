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

// ============================================
// FILE: albumSlice.js
// PURPOSE: Manages the list of uploaded event photos in Redux state
// HOW IT WORKS:
//   - Holds three pieces of state:
//     * images: array of photo objects (each has image_url, user info, etc.)
//     * loading: true while fetching images from the server
//     * error: error message if fetch fails, or null
//   - fetchImages(eventCode): async thunk that GETs images from /image/fetchImages/{eventCode}
//   - clearImages: action to empty the images array (used when leaving an event)
//   - Handles pending/fulfilled/rejected states automatically via extraReducers
// CONNECTS TO: Album component (dispatches fetchImages), Home (dispatches clearImages), store.js
// USER IMPACT: Keeps all event photos in memory so the gallery can display them instantly
//   without re-fetching every time the user scrolls or navigates within the event.
// ============================================
