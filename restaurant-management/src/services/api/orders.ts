import axios from 'axios';
import { Order } from '../../types';

const API_URL = import.meta.env.VITE_SOCKET_URL;

export const ordersApi = {
  getAll: async () => {
    const response = await axios.get<Order[]>(`${API_URL}/orders/all`);
    return response.data;
  },

  add: async (order: Omit<Order, '_id'>) => {
    const response = await axios.post<Order>(`${API_URL}/orders/add`, order);
    console.log(response.data);
    return response.data;
  },

  updateStatus: async (orderId: number, status: Order['status']) => {
    const response = await axios.patch<Order>(`${API_URL}/orders/${orderId}/status`, { status });
    return response.data;
  },

  addItems: async (orderId: number, items: Array<{ menuItemId: number; quantity: number }>) => {
    const response = await axios.post<Order>(`${API_URL}/orders/${orderId}/items/add`, { items });
    return response.data;
  },

  update: async (id: number, orderData: Partial<Order>) => {
    const response = await axios.put(`${API_URL}/orders/${id}/update`, orderData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(`${API_URL}/orders/${id}/delete`);
    return response.data;
  },
}; 