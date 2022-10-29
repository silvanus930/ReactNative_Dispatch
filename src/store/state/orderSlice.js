import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, get } from "../servies/api";
import { ordersFilter } from "../utils/orderFilter";

export const getOrders = createAsyncThunk('orders/get', async (body, { rejectWithValue }) => {
  try {
    const result = await api.get(`/work_orders/assignee.php/?assignee=${body}`);
    return result.data;
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
});

export const getOrder = createAsyncThunk('order/get', async (body, { rejectWithValue }) => {
  try {
    const result = await api.get(`/work_orders/details.php?id=${body}`);
    return result.data

  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})
export const getAttachment = createAsyncThunk('attachment/get', async (body, { rejectWithValue }) => {
  try {
    // https://app.dispatch.inc/api/work_orders/attachments.php/?order_id=32
    const result = await api.get(`/work_orders/attachments.php/?order_id=${body}`);
    return result.data

  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    openOrders: [],
    images: [],
    selectedImg: [],
    completeOrders: [],
    errors: {},
    orderDetails: {},
    uploadStats: {},
    totalImages: 0,
    attachments: []
  },
  reducers: {
    setOrders: (state, action) => {
      state.openOrders = action.payload;
    },
    setComOrders: (state, action) => {
      state.completeOrders = action.payload;
    },
    setOrder: (state, action) => {
      state.orderDetails = action.payload;
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
    setSelectedImg: (state, action) => {
      state.selectedImg = action.payload;
    },
    setTotalImages: (state, action) => {
      state.totalImages = action.payload;
    },
    setUploadStats: (state, action) => {
      state.uploadStats = action.payload;
    }
  },
  extraReducers: {
    [getOrders.pending]: (state) => {
      state.loading = true
    },
    [getOrder.pending]: (state) => {
      state.loading = true
    },
    [getAttachment.pending]: (state) => {
      state.loading = true
    },
    [getOrders.fulfilled]: (state, { payload }) => {
      if (Array.isArray(payload)) {
        const ordersData = ordersFilter(payload);
        state.openOrders = ordersData.openOrders
        state.completeOrders = ordersData.completeOrders
        Array.isArray(ordersData.openOrders) && AsyncStorage.setItem('openOrders', JSON.stringify(ordersData.openOrders))
        Array.isArray(ordersData.completeOrders) && AsyncStorage.setItem('completeOrders', JSON.stringify(ordersData.completeOrders))
        state.loading = false
      }
    },
    [getOrder.fulfilled]: (state, { payload }) => {
      state.orderDetails = payload[0]
      state.loading = false
    },
    [getAttachment.fulfilled]: (state, { payload }) => {
      if (Array.isArray(payload)) {
        state.attachments = payload
      }
      state.loading = false
    },
    [getOrders.rejected]: (state, { payload }) => {
      state.errors = payload;
      if (payload?.error.includes("Expired token")) {
        AsyncStorage.removeItem('token');
      }
      state.loading = false
    },
    [getOrder.rejected]: (state) => {
      state.loading = false
    },
    [getAttachment.rejected]: (state) => {
      state.loading = false
    },
  },
});

export const { setOrders, setOrder, setComOrders, setImages, setSelectedImg, setTotalImages, setUploadStats } = orderSlice.actions

export default orderSlice.reducer