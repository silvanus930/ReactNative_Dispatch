import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../servies/api";
import jwt_decode from "jwt-decode";

const appRatingSlice = createSlice({
  name: 'appRating',
  initialState: {
    installDate: '',
    appRated: false,
    remindMeDate: ''
  },
  reducers: {
    setInstallDate(state, { payload }) {
      state.installDate = payload;
    },
    setAppRated(state, { payload }) {
      state.appRated = payload;
    },
    setRemindMeLater(state, { payload }) {
      state.remindMeDate = payload;
    }
  },

});

export const { setInstallDate, setAppRated, setRemindMeLater, } = appRatingSlice.actions

export default appRatingSlice.reducer