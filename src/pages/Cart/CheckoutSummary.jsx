import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Container, Card, CardContent, Table,
  TableBody, TableCell, TableHead, TableRow, Button, Stack, List, ListItem, ListItemText, Divider, CardActions
} from '@mui/material';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import UserPageTitle from '../../components/UserPageTitle';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

export function CheckoutSummary() {
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [stripePromise, setStripePromise] = useState(() => loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISHING_KEY}`));
  const [clientSecret, setClientSecret] = useState("");

  const fetchOrderDetails = async () => {
    try {
      const response = await http.get(`/Order/${orderId}`);
      if (response.status === 200) {
        console.log(response.data);
        setOrder(response.data);
        setNewStatus(response.data.orderStatus);
        setNewPaymentMethod(response.data.orderPaymentMethod);

        try {
          console.log(response.data.TotalAmount.toFixed(2))
          const paymentIntentResponse = await http.post("/payments/create-payment-intent", {
            amount: response.data.TotalAmount.toFixed(2) * 100,
            orderId: orderId
          });
          if (paymentIntentResponse.status === 200) {
            setClientSecret(paymentIntentResponse.data.clientSecret);
          }
        } catch (error) {
          console.error("Failed to create payment intent:", error.response ? error.response.data : error);
          toast.error("Failed to initialize payment: " + error.message);
        }
      }
    } catch (error) {
      console.error("Failed to retrieve order details:", error.response ? error.response.data : error);
      toast.error("Failed to retrieve order details: " + error.message);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (!order) {
    return <Typography>Loading order details...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <ToastContainer />
      <UserPageTitle title="Order Payment" backbutton />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: '3 0', marginRight: 2 }}>
          <Card>
            <CardContent>
              {clientSecret && stripePromise && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm orderId={orderId}/>
                </Elements>
              )}
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 0' }}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <RequestQuoteIcon />
                <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                  Order Summary
                </Typography>
              </Stack>
              <List>
                <ListItem>
                  <ListItemText primary="Subtotal" />
                  <Typography variant="h6">${order && order.SubTotalAmount ? order.SubTotalAmount.toFixed(2) : 'N/A'}</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="GST (9%)" />
                  {/* Assuming your order object has a property for GST */}
                  <Typography variant="h6">${order && order.GstAmount ? order.GstAmount.toFixed(2) : 'N/A'}</Typography>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Total" />
                  {/* Assuming your order object has a property for total */}
                  <Typography variant="h6">${order && order.TotalAmount ? order.TotalAmount.toFixed(2) : 'N/A'}</Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
