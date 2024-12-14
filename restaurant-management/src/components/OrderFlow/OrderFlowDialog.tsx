import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Step,
  StepLabel,
  Stepper
} from '@mui/material';
import { useState } from 'react';
import { Customer, Table } from '../../types';
import CustomerInfo from './steps/CustomerInfo';
import OrderItems from './steps/OrderItems';
import OrderReview from './steps/OrderReview';
import TableSelection from './steps/TableSelection';
import { ordersApi } from '../../services/api';
import { useDispatch } from 'react-redux';
import { addOrder } from '../../store/features/ordersSlice';

interface OrderFlowDialogProps {
  open: boolean;
  onClose: () => void;
}

interface OrderItemTemp {
  menuItemId: number;
  quantity: number;
}

interface OrderFlowState {
  selectedTable: Table | null;
  customer: Customer | null;
  orderItems: OrderItemTemp[];
  activeStep: number;
}

const initialState: OrderFlowState = {
  selectedTable: null,
  customer: null,
  orderItems: [],
  activeStep: 0
};

const STEPS = ['Select Table', 'Customer Information', 'Place Order', 'Review'] as const;

export const OrderFlowDialog = ({ open, onClose }: OrderFlowDialogProps) => {
  const dispatch = useDispatch();
  const [orderFlow, setOrderFlow] = useState<OrderFlowState>(initialState);
  const { selectedTable, customer, orderItems, activeStep } = orderFlow;

  const handleNext = () => {
    setOrderFlow(prev => ({ ...prev, activeStep: prev.activeStep + 1 }));
  };

  const handleBack = () => {
    setOrderFlow(prev => ({ ...prev, activeStep: prev.activeStep - 1 }));
  };

  const handleComplete = async () => {
    try {
      const newOrder = {
        tableId: selectedTable!._id,
        customerId: customer!._id,
        itemIDs: orderItems.map(item => ({
          itemID: item.menuItemId,
          quantity: item.quantity
        })),
        status: 'Placed' as const,
        createdAt: new Date()
      };

      const createdOrder = await ordersApi.add(newOrder);
      dispatch(addOrder(createdOrder));
      
      onClose();
      setOrderFlow(initialState);
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogContent>
        <Box sx={{ width: '100%', mt: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <TableSelection 
              selectedTable={selectedTable}
              onSelect={(table: Table) => {
                setOrderFlow(prev => ({ ...prev, selectedTable: table }));
              }}
            />
          )}

          {activeStep === 1 && selectedTable && (
            <CustomerInfo
              selectedCustomer={customer}
              onSelect={(customer: Customer) => {
                setOrderFlow(prev => ({ ...prev, customer }));
              }}
            />
          )}

          {activeStep === 2 && selectedTable && customer && (
            <OrderItems
              table={selectedTable}
              customer={customer}
              items={orderItems}
              setItems={(items) => setOrderFlow(prev => ({ ...prev, orderItems: items }))}
            />
          )}

          {activeStep === 3 && selectedTable && customer && (
            <OrderReview
              table={selectedTable}
              customer={customer}
              items={orderItems}
            />
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === STEPS.length - 1 ? handleComplete : handleNext}
              disabled={
                (activeStep === 0 && !selectedTable) ||
                (activeStep === 1 && !customer) ||
                (activeStep === 2 && orderItems.length === 0)
              }
            >
              {activeStep === STEPS.length - 1 ? 'Place Order' : 'Next'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}; 