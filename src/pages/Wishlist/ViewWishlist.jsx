import React, { useEffect, useState } from 'react';
import { Grid, Box, CardMedia, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { validateUser } from '../../functions/user';
import http from "../../http";
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserPageTitle from '../../components/UserPageTitle';

function ViewWishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null); 
    const navigate = useNavigate();
    const eventPath = `${import.meta.env.VITE_FILE_BASE_URL}`;

    const handleGetWishlistItems = () => {
        http.get('/wishlist')
            .then((response) => {
                console.log(response.data);
                const wishlistItemsData = response.data.map(item => {
                    return {
                        ...item,
                        eventName: item.eventName,
                        eventPicture: item.event.eventPicture,
                        eventPrice: item.eventPrice
                    };
                });
                setWishlistItems(wishlistItemsData);
            })
            .catch((error) => {
                console.error('Error fetching wishlist items:', error);
            });
    };

    const handleRemoveItem = (itemId) => {
        setSelectedItemId(itemId); 
        setOpenDialog(true);
    };

    const handleConfirmRemoveItem = async () => {
        try {
            const response = await http.delete(`/wishlist/${selectedItemId}`, {
                data: { EventId: selectedItemId },
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (response.status === 200) {
                handleGetWishlistItems();
                toast.success("Item removed from wishlist");
            }
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
            toast.error("Error removing item from wishlist");
        }
        setOpenDialog(false);
    };
    
    
    const clearWishlist = () => {
        http.delete('/wishlist')
            .then((response) => {
                if (response.status === 200) {
                    setWishlistItems([]);
                    toast.success("Wishlist cleared successfully");
                }
            })
            .catch((error) => {
                console.error('Error clearing wishlist:', error);
                toast.error("Error clearing wishlist");
            });
    };

    useEffect(() => {
        if (!validateUser()) {
            toast.error("You must be logged in to view this page");
            navigate("/login");
        } else {
            document.title = 'Your Wishlist';
            handleGetWishlistItems();
        }
    }, []);

    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
            <UserPageTitle title="Your Wishlist" subtitle="View Items" />
            {wishlistItems.length > 0 && (<Button onClick={clearWishlist}>Clear Wishlist</Button>)}
            {wishlistItems.length === 0 && (<Button onClick={() => navigate('/events')}>Go to Events</Button>)}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        {wishlistItems.length > 0 ?
                            (
                                <>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell>Product Image</TableCell>
                                                <TableCell align="center">Price</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {wishlistItems.map((item, index) => (
                                                <TableRow key={item.id}>
                                                    <TableCell component="th" scope="row">
                                                        <Typography
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => navigate('/events/' + item.eventId)}>{item.eventName}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <CardMedia
                                                            component="img"
                                                            sx={{
                                                                width: 340,
                                                                height: 140,
                                                                objectFit: 'cover'
                                                            }}
                                                            image={`${eventPath}${JSON.parse(item.eventPicture)[0]}`}
                                                            alt={item.eventName}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">${item.eventPrice.toFixed(2)}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton aria-label="delete" onClick={() => handleRemoveItem(item.eventId)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </>
                            ) : (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={7} style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                <Typography variant="h6">
                                                    Your Wishlist is empty
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            )
                        }
                    </TableContainer>
                </Grid>
            </Grid>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Remove Item</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove this item from your wishlist?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmRemoveItem} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Container>
    )
}

export default ViewWishlist;
