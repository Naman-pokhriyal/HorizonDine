import axios from 'axios';
import { Table } from '../../types';

const API_URL = import.meta.env.VITE_SOCKET_URL;

export const tablesApi = {
  getAll: async () => {
    const response = await axios.get<Table[]>(`${API_URL}/tables/all`);
    return response.data;
  },

  add: async (table: Omit<Table, '_id'>) => {
    const response = await axios.post<Table>(`${API_URL}/tables/add`, table);
    return response.data;
  },

  updateStatus: async (tableId: number, status: Table['status']) => {
    const response = await axios.patch<Table>(`${API_URL}/tables/${tableId}/status`, { status });
    return response.data;
  }
}; 