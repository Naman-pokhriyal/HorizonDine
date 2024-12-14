import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '../../types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_SOCKET_URL;

interface MenuState {
  items: MenuItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedCategory: 'all' | 'appetizer' | 'main' | 'dessert' | 'beverage';
}

const initialState: MenuState = {
  items: [],
  status: 'idle',
  error: null,
  selectedCategory: 'all'
};

// Async thunk for fetching menu items
export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async () => {
    const response = await axios.get(`${API_URL}/menu/all`);
    return response.data;
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<MenuState['selectedCategory']>) => {
      state.selectedCategory = action.payload;
    },
    addMenuItem: (state, action: PayloadAction<Omit<MenuItem, 'id'>>) => {
      const newId = Math.max(...state.items.map(item => item._id)) + 1;
      state.items.push({ ...action.payload, _id: newId });
    },
    updateMenuItem: (state, action: PayloadAction<MenuItem>) => {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteMenuItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch menu items';
      });
  }
});

// Selector
export const selectMenu = (state: { menu: MenuState }) => state.menu;
export const selectFilteredItems = (state: { menu: MenuState }) => {
  const { items, selectedCategory } = state.menu;
  return selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);
};

export const {
  setCategory,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = menuSlice.actions;

export default menuSlice.reducer; 