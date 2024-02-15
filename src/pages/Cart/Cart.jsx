import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Table,
  TableBody, TableCell, TableHead, TableRow, IconButton,
  Container, Checkbox, Tooltip, Stack, List, ListItem, ListItemText, Divider, CardActions,
} from '@mui/material';
import http from '../../http';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import UserPageTitle from '../../components/UserPageTitle';


export function ViewCart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [invalidItems, setInvalidItems] = useState([]);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      const response = await http.get('/Cart');
      if (response.status === 200) {
        const items = response.data;
        const validItems = items.filter(item => item.eventStatus); // Filter out items with eventStatus
        const invalid = items.filter(item => !item.eventStatus);
        setCartItems(validItems);
        setInvalidItems(invalid);
      }
    } catch (error) {
      toast.error("Failed to retrieve cart items: " + error.message);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);


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
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
    const subTotalAmount = selectedCartItems.reduce((acc, item) => acc + (item.quantity * item.eventPrice), 0);
    const gstRate = 0.09; // Assuming 9% GST rate
    const gstAmount = parseFloat((subTotalAmount * gstRate).toFixed(2));
    const totalAmount = parseFloat((subTotalAmount + gstAmount).toFixed(2));
    return {
      subTotal: subTotalAmount.toFixed(2),
      gst: gstAmount.toFixed(2),
      total: totalAmount.toFixed(2),
      noOfItems: cartItems.reduce((acc, item) => acc + item.quantity, 0)
    };
  };

  const handleCheckout = async () => {

    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
    const subTotalAmount = selectedCartItems.reduce((acc, item) => acc + (item.quantity * item.eventPrice), 0);
    const gstRate = 0.09; // Assuming 9% GST rate
    const gstAmount = parseFloat((subTotalAmount * gstRate).toFixed(2));
    const totalAmount = parseFloat((subTotalAmount + gstAmount).toFixed(2));
    const noOfItems = selectedCartItems.reduce((acc, item) => acc + item.quantity, 0);

    try {
      const order = {
        OrderStatus: "Pending",
        SubTotalAmount: subTotalAmount,
        GstAmount: gstAmount,
        TotalAmount: totalAmount,
        NoOfItems: noOfItems,
        OrderPaymentMethod: "NIL",
        OrderItems: selectedCartItems.map(item => ({
          EventId: item.eventId,
          Quantity: item.quantity,
          TotalPrice: item.quantity * item.eventPrice,
          Discounted: 0,
          DiscountedTotalPrice: item.quantity * item.eventPrice
        }))
      };

      const orderResponse = await http.post(`/Order`, order);
      if (orderResponse.status === 200) {
        const orderId = orderResponse.data.orderId;

        console.log("Order created successfully!");

        setSelectedItems([]);
        setCartItems([]);

        navigate('/cart/checkout/' + orderId);
      }
    } catch (error) {
      console.error("Failed to complete the order process:", error.response ? error.response.data : error);
      toast.error("Failed to complete the order process: " + (error.response?.data.message || error.message));
    }
  };

  return (
    <Container maxWidth="lg" sx={{
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      mt: 4
    }}>
      <ToastContainer />
      {cartItems.length > 0 ? (
        <Box>
          <UserPageTitle title="Your Cart" backbutton />
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
            {/* {Order Summary} */}
            <Grid item xs={12} md={3}>
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <RequestQuoteIcon />
                    <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                      Order Summary
                    </Typography>
                  </Stack>
                </CardContent>
                <List>
                  <ListItem>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="h6">${calculateTotal().subTotal}</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="GST (9%)" />
                    <Typography variant="h6">${calculateTotal().gst}</Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Total" />
                    <Typography variant="h6">${calculateTotal().total}</Typography>
                  </ListItem>
                </List>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={selectedItems.length === 0}
                    onClick={handleCheckout}
                    sx={{ width: '100%' }}
                  >
                    Checkout Selected
                  </Button>
                </CardActions>
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
      )
      }
        {
        invalidItems.length > 0 && (
          <Box mt={4}>
                      <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
            <Typography variant="h5" gutterBottom>
              Invalid Items
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invalidItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.eventName}</TableCell>
                    <TableCell align="right">${item.eventPrice}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleRemoveItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </Grid>
          </Grid>
          </Box>
        )
      }
    </Container >
  );
}