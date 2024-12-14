import { configureStore } from '@reduxjs/toolkit';
import tablesReducer from './features/tablesSlice';
import menuReducer from './features/menuSlice';
import ordersReducer from './features/ordersSlice';
import customersReducer from './features/customersSlice';
export const store = configureStore({
  reducer: {
    tables: tablesReducer,
    menu: menuReducer,
    orders: ordersReducer,
    customers: customersReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 