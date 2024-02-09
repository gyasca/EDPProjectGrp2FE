import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Table,
  TableBody, TableCell, TableHead, TableRow, IconButton,
  Container, Checkbox
} from '@mui/material';
import http from '../../http';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function ViewCart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      const response = await http.get('/Cart');
      if (response.status === 200) {
        setCartItems(response.data);
      }
    } catch (error) {
      toast.error("Failed to retrieve cart items: " + error.message);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      const response = await http.put(`/Cart/${itemId}`, { quantity: quantity });
      if (response.status === 200) {
        fetchCartItems(); // Refresh cart items after quantity update
      }
    } catch (error) {
      toast.error("Failed to update quantity: " + error.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await http.delete(`/Cart/${itemId}`);
      if (response.status === 200) {
        fetchCartItems(); // Refresh cart items after removing an item
      }
    } catch (error) {
      toast.error("Failed to remove item: " + error.message);
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await http.delete('/Cart');
      if (response.status === 200) {
        fetchCartItems(); // Refresh cart items after clearing the cart
      }
    } catch (error) {
      toast.error("Failed to clear cart: " + error.message);
    }
  };

  const handleSelectItem = (itemId) => {
    const selectedIndex = selectedItems.indexOf(itemId);
    let newSelectedItems = [];

    if (selectedIndex === -1) {
      newSelectedItems = newSelectedItems.concat(selectedItems, itemId);
    } else if (selectedIndex === 0) {
      newSelectedItems = newSelectedItems.concat(selectedItems.slice(1));
    } else if (selectedIndex === selectedItems.length - 1) {
      newSelectedItems = newSelectedItems.concat(selectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedItems = newSelectedItems.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1),
      );
    }

    setSelectedItems(newSelectedItems);
  };

  const isSelected = (id) => selectedItems.indexOf(id) !== -1;

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedItems = cartItems.map((n) => n.id);
      setSelectedItems(newSelectedItems);
      return;
    }
    setSelectedItems([]);
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      if (selectedItems.includes(item.id)) {
        return acc + (item.quantity * item.eventPrice);
      }
      return acc;
    }, 0).toFixed(2);
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await http.get('/user/auth', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userData = response.data.user;
        setUserId(userData.id);
        fetchCartItems();
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error("Failed to fetch user data. Please try again.");
      }
    };
  
    fetchUserData();
  }, []);
  
  
  const handleCheckout = async () => {
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }
  
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
  
    const subTotalAmount = selectedCartItems.reduce((acc, item) => acc + (item.quantity * item.eventPrice), 0);
    const gstRate = 0.09; // Assuming 9% GST rate
    const gstAmount = parseFloat((subTotalAmount * gstRate).toFixed(2));
    const totalAmount = parseFloat((subTotalAmount + gstAmount).toFixed(2));
    const noOfItems = selectedCartItems.reduce((acc, item) => acc + item.quantity, 0);
  
    const order = {
      orderStatus: "Pending", 
      subTotalAmount: subTotalAmount,
      gstAmount: gstAmount,
      totalAmount: totalAmount,
      noOfItems: noOfItems,
      orderPaymentMethod: "Online", 
      orderItems: [],
    };
  
    console.log("Order:", order);
  
    try {
      const response = await http.post(`/Order`, order); 
      if (response.status === 200) {
        toast.success("Order created successfully!");
        setSelectedItems([]);
        setCartItems([]);
        navigate('/'); 
      }
    } catch (error) {
      console.error("Failed to create order:", error.response ? error.response.data : error);
      toast.error("Failed to create order: " + (error.response?.data.message || error.message));
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ my: 2 }}>
      <ToastContainer />
      {cartItems.length > 0 ? (
        <Box>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: '10px', my: 2, cursor: 'pointer' }} onClick={() => navigate('/events')}>
            <ArrowBackIcon /> Your cart
          </Typography>
          <Grid item xs={12}>
            <Button variant="contained" color="secondary" onClick={handleClearCart}>
              Clear Cart
            </Button>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedItems.length > 0 && selectedItems.length < cartItems.length}
                        checked={cartItems.length > 0 && selectedItems.length === cartItems.length}
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell>Event Name</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow
                      key={item.id}
                      selected={isSelected(item.id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Link to={`/events/${item.eventId}`}>
                          {item.eventName}
                        </Link>
                      </TableCell>
                      <TableCell align="right">${item.eventPrice}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}>
                          <RemoveIcon />
                        </IconButton>
                        {item.quantity}
                        <IconButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                          <AddIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">${(item.quantity * item.eventPrice).toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleRemoveItem(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Order Summary</Typography>
                  <Typography>Subtotal: ${calculateTotal()}</Typography>
                </CardContent>
                <Button variant="contained" color="primary" onClick={handleCheckout}>Checkout Selected</Button>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
          <Typography variant="h3" gutterBottom>
            Your cart is empty
          </Typography>
          <Button variant="contained" color="primary" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
            Return to Homepage
          </Button>
        </Box>
      )}
    </Container>
  );
}
