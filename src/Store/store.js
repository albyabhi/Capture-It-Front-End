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
