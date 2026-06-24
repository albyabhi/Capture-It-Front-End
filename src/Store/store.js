import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './roomSlice';
import userReducer from './userSlice';
import albumReducer from './albumSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    room: roomReducer, 
    user: userReducer,
    album: albumReducer,
    auth: authReducer,
  },
});

export default store;
