import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Table } from '../../types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_SOCKET_URL;

interface TablesState {
  tables: Table[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TablesState = {
  tables: [],
  status: 'idle',
  error: null
};

// Async thunk for fetching tables
export const fetchTables = createAsyncThunk(
  'tables/fetchTables',
  async () => {
    const response = await axios.get(`${API_URL}/tables/all`);
    return response.data;
  }
);

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    updateTableStatus: (state, action: PayloadAction<{ 
      tableId: number; 
      status: Table['status'] 
    }>) => {
      const table = state.tables.find(t => t._id === action.payload.tableId);
      if (table) {
        table.status = action.payload.status;
      }
    },
    addTable: (state, action: PayloadAction<Omit<Table, 'id'>>) => {
      const newId = Math.max(...state.tables.map(t => t._id)) + 1;
        state.tables.push({ ...action.payload, _id: newId });
    },
    updateTable: (state, action: PayloadAction<Table>) => {
      const index = state.tables.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tables[index] = action.payload;
      }
    },
    deleteTable: (state, action: PayloadAction<number>) => {
      state.tables = state.tables.filter(t => t._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tables = action.payload;
        state.error = null;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tables';
      });
  }
});

// Selector
export const selectTables = (state: { tables: TablesState }) => state.tables;
export const {
  updateTableStatus,
  addTable,
  updateTable,
  deleteTable
} = tablesSlice.actions;
export default tablesSlice.reducer; 