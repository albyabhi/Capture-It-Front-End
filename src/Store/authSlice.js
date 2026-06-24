import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/signup`, { username, email, password }, { withCredentials: true });
      localStorage.setItem('authToken', response.data.accessToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, { email, password }, { withCredentials: true });
      localStorage.setItem('authToken', response.data.accessToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return rejectWithValue('No token');
      const response = await axios.get(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      localStorage.removeItem('authToken');
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem('authToken');
      return true;
    } catch {
      localStorage.removeItem('authToken');
      return rejectWithValue('Logout failed');
    }
  }
);

export const fetchMyEvents = createAsyncThunk(
  'auth/fetchMyEvents',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${apiUrl}/auth/my-events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.rooms;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    account: null,
    isAuthenticated: false,
    loading: true,
    myEvents: [],
    eventsLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.account = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.myEvents = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.account = action.payload.account;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.account = action.payload.account;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.account = action.payload.account;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.account = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.account = null;
        state.isAuthenticated = false;
        state.myEvents = [];
      })
      .addCase(logout.rejected, (state) => {
        state.account = null;
        state.isAuthenticated = false;
        state.myEvents = [];
      })
      .addCase(fetchMyEvents.pending, (state) => { state.eventsLoading = true; })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.eventsLoading = false;
        state.myEvents = action.payload;
      })
      .addCase(fetchMyEvents.rejected, (state) => { state.eventsLoading = false; });
  },
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
