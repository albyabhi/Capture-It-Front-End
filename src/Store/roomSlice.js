import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roomData: null,
  loading: false,
  error: null,
  eventCode: null,  // Add eventCode to the state
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomData: (state, action) => {
      state.roomData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setEventCode: (state, action) => {  // Add setEventCode action
      state.eventCode = action.payload;
    },
  },
});

export const { setRoomData, setLoading, setError, setEventCode } = roomSlice.actions;

export default roomSlice.reducer;
