import { configureStore } from '@reduxjs/toolkit';
import auth from './state/authSlice';
import order from './state/orderSlice';
import appRating from './state/appRating';

export const store = configureStore({
  reducer: {
    auth,
    order, 
    appRating
  }
})