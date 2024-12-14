import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '../../types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_SOCKET_URL;

interface CustomersState {
  customers: Customer[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CustomersState = {
  customers: [],
  status: 'idle',
  error: null
};

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {
    const response = await axios.get(`${API_URL}/customers/all`);
    return response.data;
  }
);

export const addCustomerAsync = createAsyncThunk(
  'customers/addCustomer',
  async (customer: Omit<Customer, 'id'>) => {
    const response = await axios.post(`${API_URL}/customers`, customer);
    return response.data;
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    // Local CRUD operations
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action: PayloadAction<number>) => {
      state.customers = state.customers.filter(c => c._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customers = action.payload;
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch customers';
      })
      // Add Customer
      .addCase(addCustomerAsync.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      });
  }
});

// Selectors
export const selectCustomers = (state: { customers: CustomersState }) => state.customers;

export const {
  addCustomer,
  updateCustomer,
  deleteCustomer
} = customersSlice.actions;

export default customersSlice.reducer; 