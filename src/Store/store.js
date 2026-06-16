import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './roomSlice';
import userReducer from './userSlice';
import albumReducer from './albumSlice';

const store = configureStore({
  reducer: {
    room: roomReducer, 
    user: userReducer,
    album: albumReducer,
},
});

export default store;

// ============================================
// FILE: store.js
// PURPOSE: Configures the Redux store that holds all global state for the app
// HOW IT WORKS: Combines three state slices into one store:
//   - "room": holds current room/event information (name, code, loading status)
//   - "user": holds the logged-in user's data (name, token)
//   - "album": holds the list of uploaded images and loading state
//   Components can read and update this state from anywhere in the app.
// CONNECTS TO: roomSlice, userSlice, albumSlice, and all components using useSelector/useDispatch
// USER IMPACT: Enables the app to remember the user's login, current room, and uploaded photos
//   as they navigate between pages without losing data.
// ============================================
