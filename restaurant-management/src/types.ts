export interface Table {
  _id: number;
  no: number;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';
  currentOrder?: Order;
}

export interface MenuItem {
  _id: number;
  name: string;
  price: number;
  description: string;
  category: 'appetizer' | 'main' | 'dessert' | 'Drinks';
  image?: string;
}


export interface Order {
  _id: number;
  tableId: number;
  customerId: number;
  itemIDs: Array<{
    itemID: number;
    quantity: number;
  }>;
  status: 'Placed' | 'Preparing' | 'Ready' | 'Payment' | 'Done';
  createdAt: Date;
  endTime?: Date;
}

export interface Customer {
  _id: number;
  fname: string;
  lname: string;
  phone: string;
  email?: string;
  notes:string;
} 