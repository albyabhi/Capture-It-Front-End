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

// ============================================
// FILE: roomSlice.js
// PURPOSE: Manages the current room/event information in Redux state
// HOW IT WORKS:
//   - Holds four pieces of state:
//     * roomData: the room object (event name, owner, etc.) or null
//     * loading: true while fetching room data from the server
//     * error: error message if something went wrong, or null
//     * eventCode: the 6-character room code for the current event
//   - Provides actions: setRoomData, setLoading, setError, setEventCode
// CONNECTS TO: EventRoom (dispatches all actions), store.js (combines this reducer)
// USER IMPACT: Stores the current event's details so all components can access
//   the event name, code, and status without re-fetching from the server.
// ============================================
