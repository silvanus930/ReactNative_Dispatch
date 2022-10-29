import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, post } from "../servies/api";
import jwt_decode from "jwt-decode";

export const signin = createAsyncThunk('user/signin', async (body, { rejectWithValue }) => {
  try {
    const result = await api.post('/auth/login.php', body);
    return result.data;
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const signup = createAsyncThunk('user/signup', async (body, { rejectWithValue }) => {
  try {
    const result = await api.post('/auth/register.php', body);
    return result.data
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const profileEdit = createAsyncThunk('user/updateProfile', async (body, { rejectWithValue }) => {
  try {
    const result = await api.postAuth('/users/settings.php', body);
    return result.data
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const getProfile = createAsyncThunk('user/profile', async (body, { rejectWithValue }) => {
  try {
    const result = await api.get(`/users/details.php?user_id=${body}`);
    return result.data;
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    profile: null,
    userId: null,
    loading: false,
    message: null,
    isAuth: false,
    confirm: false
  },
  reducers: {
    setConfirm: (state, action) => {
      state.confirm = action.payload;
    },
    setAuth: (state, action) => {
      state.isAuth = action.payload;
      (!action.payload) && AsyncStorage.removeItem('token');
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
  extraReducers: {
    [signin.pending]: (state) => {
      state.loading = true
    },
    [signup.pending]: (state) => {
      state.loading = true
    },
    [getProfile.pending]: (state) => {
      state.loading = true
    },
    [profileEdit.pending]: (state) => {
      state.loading = true
    },
    [signin.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.user = payload
      state.message = payload.message && payload.message
      if (payload.jwt) {
        state.isAuth = true
        const { data } = jwt_decode(payload.jwt);
        state.userId = data.id;
        AsyncStorage.setItem('token', payload.jwt)
      }
    },
    [signup.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.user = payload
      state.message = payload.message && payload.message
    },
    [profileEdit.fulfilled]: (state, { payload }) => {
      if (payload.user) {
        state.profile = payload.user
        AsyncStorage.setItem('userInfo', JSON.stringify(payload.user))
        state.loading = false
      }
    },
    [getProfile.fulfilled]: (state, { payload }) => {
      state.profile = payload
      AsyncStorage.setItem('userInfo', JSON.stringify(payload))
      state.loading = false
    },
    [signin.rejected]: (state, { payload }) => {
      state.loading = false
    },
    [signup.rejected]: (state) => {
      state.loading = false
    },
  },
});

export const { setAuth, setConfirm, setProfile, setUserId, setMessage } = authSlice.actions

export default authSlice.reducer