import axios from 'axios';
import { Customer } from '../../types';

const API_URL = import.meta.env.VITE_SOCKET_URL;

export const customersApi = {
  getAll: async () => {
    const response = await axios.get<Customer[]>(`${API_URL}/customers/all`);
    return response.data;
  },

  add: async (customer: Omit<Customer, '_id'>) => {
    const response = await axios.post<Customer>(`${API_URL}/customers/add`, customer);
    return response.data;
  },

  update: async (customerId: number, customer: Partial<Customer>) => {
    const response = await axios.patch<Customer>(`${API_URL}/customers/${customerId}/update`, customer);
    return response.data;
  }
}; 