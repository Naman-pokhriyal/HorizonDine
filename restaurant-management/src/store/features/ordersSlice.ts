import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../types';
import axios from 'axios';
import { ordersApi } from '../../services/api/orders';

const API_URL = import.meta.env.VITE_SOCKET_URL;

interface OrdersState {
  orders: Order[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedStatus: 'all' | 'Placed' | 'Preparing' | 'Ready' | 'Payment' | 'Done';
}

const initialState: OrdersState = {
  orders: [],
  status: 'idle',
  error: null,
  selectedStatus: 'all'
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    return await ordersApi.getAll();
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }: { orderId: number; status: Order['status'] }) => {
    const response = await axios.patch(`${API_URL}/orders/${orderId}/status`, { status });
    return response.data;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // CRUD Operations
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
      console.log(state.orders);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(o => o._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    deleteOrder: (state, action: PayloadAction<number>) => {
      state.orders = state.orders.filter(o => o._id !== action.payload);
    },
    // Order Items Operations
    addOrderItem: (state, action: PayloadAction<{ 
      orderId: number; 
      item: { itemID: number; quantity: number; }
    }>) => {
      const order = state.orders.find(o => o._id === action.payload.orderId);
      if (order) {
        order.itemIDs.push(action.payload.item);
      }
    },
    removeOrderItem: (state, action: PayloadAction<{ 
      orderId: number; 
      menuItemId: number 
    }>) => {
      const order = state.orders.find(o => o._id === action.payload.orderId);
      if (order) {
        order.itemIDs = order.itemIDs.filter(item => item.itemID !== action.payload.menuItemId);
      }
    },
    // Status Operations
    setOrderStatus: (state, action: PayloadAction<{ orderId: number; status: Order['status'] }>) => {
      const order = state.orders.find(o => o._id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
    setSelectedStatus: (state, action: PayloadAction<OrdersState['selectedStatus']>) => {
      state.selectedStatus = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  }
});

// Selectors
export const selectOrders = (state: { orders: OrdersState }) => state.orders;
export const selectFilteredOrders = (state: { orders: OrdersState }) => {
  const { orders, selectedStatus } = state.orders;
  return selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);
};

export const {
  addOrder,
  updateOrder,
  deleteOrder,
  addOrderItem,
  removeOrderItem,
  setOrderStatus,
  setSelectedStatus
} = ordersSlice.actions;

export default ordersSlice.reducer; 