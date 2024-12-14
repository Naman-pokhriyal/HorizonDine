import { io } from 'socket.io-client';
import { store } from '../store';
import { Table, Order, MenuItem } from '../types';
import { 
  updateTable, 
  addTable, 
  deleteTable, 
  updateTableStatus 
} from '../store/features/tablesSlice';
import { 
  updateOrder, 
  addOrder, 
  deleteOrder 
} from '../store/features/ordersSlice';
import { 
  updateMenuItem, 
  addMenuItem, 
  deleteMenuItem 
} from '../store/features/menuSlice';

class SocketService {
  private socket: Socket | null = null;
  
  connect(url: string = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:8000') {
    this.socket = io(url);
    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    // Table events
    this.socket.on('table:update', (table: Table) => {
      store.dispatch(updateTable(table));
    });

    this.socket.on('table:create', (table: Table) => {
      store.dispatch(addTable(table));
    });

    this.socket.on('table:delete', (tableId: number) => {
      store.dispatch(deleteTable(tableId));
    });

    this.socket.on('table:statusUpdate', (data: { tableId: number; status: Table['status'] }) => {
      store.dispatch(updateTableStatus(data));
    });

    // Order events
    this.socket.on('order:update', (order: Order) => {
      store.dispatch(updateOrder(order));
    });

    this.socket.on('order:create', (order: Order) => {
      store.dispatch(addOrder(order));
    });

    this.socket.on('order:delete', (orderId: number) => {
      store.dispatch(deleteOrder(orderId));
    });

    // Menu events
    this.socket.on('menu:update', (menuItem: MenuItem) => {
      store.dispatch(updateMenuItem(menuItem));
    });

    this.socket.on('menu:create', (menuItem: MenuItem) => {
      store.dispatch(addMenuItem(menuItem));
    });

    this.socket.on('menu:delete', (menuItemId: number) => {
      store.dispatch(deleteMenuItem(menuItemId));
    });

    // Connection status events
    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
    });
  }

  // Methods to emit events
  emitTableUpdate(tableId: number, data: any) {
    this.socket?.emit('table:update', { tableId, data });
  }

  emitOrderUpdate(orderId: number, data: any) {
    this.socket?.emit('order:update', { orderId, data });
  }

  emitMenuUpdate(menuItemId: number, data: any) {
    this.socket?.emit('menu:update', { menuItemId, data });
  }

  emitTableStatusUpdate(tableId: number, status: Table['status']) {
    this.socket?.emit('table:statusUpdate', { tableId, status });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService(); 