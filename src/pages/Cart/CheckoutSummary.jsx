import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Container, Card, CardContent, Table,
  TableBody, TableCell, TableHead, TableRow, Button, TextField, MenuItem
} from '@mui/material';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';

export function CheckoutSummary() {
  const [order, setOrder] = useState(null);
  const { orderId } = useParams(); 
  const navigate = useNavigate();
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  const fetchOrderDetails = async () => {
    try {
      const response = await http.get(`/Order/${orderId}`);
      if (response.status === 200) {
        setOrder(response.data);
        setNewStatus(response.data.orderStatus);
        setNewPaymentMethod(response.data.orderPaymentMethod);
      }
    } catch (error) {
      console.error("Failed to retrieve order details:", error.response ? error.response.data : error);
      toast.error("Failed to retrieve order details: " + error.message);
    }
  };

  console.log(order)

  const updateOrder = async () => {
    try {
      const response = await http.post(`/Order/UpdateOrder/${orderId}`, {
        NewStatus: newStatus,
        NewPaymentMethod: newPaymentMethod
      });
      if (response.status === 200) {
        toast.success("Order updated successfully");
        fetchOrderDetails(); // Refresh order details
      }
    } catch (error) {
      toast.error("Failed to update order: " + error.message);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (!order) {
    return <Typography>Loading order details...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Order Summary
      </Typography>
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.$values.map((item) => (
                <TableRow key={item.Id}>
                  <TableCell>{item.Event.name}</TableCell>
                  <TableCell align="right">{item.Quantity}</TableCell>
                  <TableCell align="right">${item.Price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography variant="h6">Total: ${order.TotalAmount ? order.TotalAmount.toFixed(2) : 'N/A'}</Typography>
          <TextField
            select
            label="Order Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            fullWidth
            margin="normal"
          >
            {['Pending', 'Completed', 'Cancelled'].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Payment Method"
            value={newPaymentMethod}
            onChange={(e) => setNewPaymentMethod(e.target.value)}
            fullWidth
            margin="normal"
          >
            {['Credit Card', 'PayPal', 'Bank Transfer'].map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" onClick={updateOrder}>Update Order</Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
