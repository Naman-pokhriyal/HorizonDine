import axios from 'axios';
import { MenuItem } from '../../types';

const API_URL = import.meta.env.VITE_SOCKET_URL;

export const menuApi = {
  getAll: async () => {
    const response = await axios.get<MenuItem[]>(`${API_URL}/menu/all`);
    return response.data;
  },

  add: async (item: Omit<MenuItem, '_id'>) => {
    const response = await axios.post<MenuItem>(`${API_URL}/menu/add`, item);
    return response.data;
  },

  update: async (itemId: number, item: Partial<MenuItem>) => {
    const response = await axios.patch<MenuItem>(`${API_URL}/menu/${itemId}/update`, item);
    return response.data;
  },

  delete: async (itemId: number) => {
    await axios.delete(`${API_URL}/menu/${itemId}/delete`);
  }
}; 