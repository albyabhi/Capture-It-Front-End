import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { userData: null },
  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;

// ============================================
// FILE: userSlice.js
// PURPOSE: Manages the logged-in user's data in Redux state
// HOW IT WORKS:
//   - Holds a single "userData" object (null when not logged in, user object when logged in)
//   - Provides one action: setUserData - to store user info after login
//   - The user object typically contains: fullName, eventCode, and other user details
// CONNECTS TO: EventRoom (dispatches setUserData), store.js (combines this reducer)
// USER IMPACT: Keeps track of who is currently logged in so the app can show their name
//   and use their identity for photo uploads and room access.
// ============================================
