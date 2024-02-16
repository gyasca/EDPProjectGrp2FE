import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Card, CardContent, CardMedia, Typography, Paper, List, ListItem, ListItemText, Divider, Box, Stack } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../../http';
import AdminPageTitle from '../../../components/AdminPageTitle';
import 'react-toastify/dist/ReactToastify.css';

function ViewSpecificOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const productPath = `${import.meta.env.VITE_FILE_BASE_URL}`;

    useEffect(() => {
        async function fetchOrder() {
            try {
                const response = await http.get("/admin/order/" + id);
                setOrder(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        }
        fetchOrder();
    }, [id]);

    const handleBackToOrders = () => {
        navigate(-1);
    };

    if (!order) {
        return 'Loading...';
    }

    return (
        <Container
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >            <Card variant='outlined'>
                <CardContent>
                    <AdminPageTitle title="Order details" subtitle={`Order ID: ${id}`} backbutton />

                    <Box marginTop={2}>
                        <Typography variant="body1" gutterBottom>
                            Payment Status: {order.OrderPaymentMethod !== 'NIL' ? "Paid" : "Not Paid"}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Order Status: {order.OrderStatus}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Customer Email: {order.User.Email}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle1" gutterBottom>
                            Order Items:
                        </Typography>
                        {order.OrderItems.$values.map((item, index) => (
                            <Box key={index} marginBottom={2}>
                                <Card variant='outlined'>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px' }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 60, height: 60, flexShrink: 0, borderRadius: '4px' }}
                                            image={`${productPath}${item.Event.EventPicture ? JSON.parse(item.Event.EventPicture)[0] : ''}`}
                                            alt={item.Event.EventName}
                                        />
                                        <Box sx={{ marginLeft: '16px', flexGrow: 1 }}>
                                            <Typography variant="body1" fontWeight={500}>
                                                {item.Event.EventName}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Quantity: {item.Quantity}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" color="primary">
                                            ${item.TotalPrice.toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                        <Divider sx={{ my: 1 }} />
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Payment Summary
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText primary="Subtotal" primaryTypographyProps={{ variant: 'body1' }} />
                                    <Typography variant="body1">${order.SubTotalAmount.toFixed(2)}</Typography>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="GST (9%)" primaryTypographyProps={{ variant: 'body1' }} />
                                    <Typography variant="body1">${order.GstAmount.toFixed(2)}</Typography>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText primary="Total" primaryTypographyProps={{ variant: 'body1' }} />
                                    <Typography variant="body1" color="primary">${order.TotalAmount.toFixed(2)}</Typography>
                                </ListItem>
                            </List>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

        </Container>
    );
}

export default ViewSpecificOrder;
