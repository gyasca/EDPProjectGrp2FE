import React, { useState, useEffect } from 'react';
import { Breadcrumbs, Link, Typography, Paper, Container, Grid, IconButton, Button, Box, Card, CardContent, CardActions, CardMedia } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../http';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MDEditor from '@uiw/react-md-editor';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import EventReviewSmall from '../Reviews/EventReviewSmall';

import Carousel from 'react-material-ui-carousel';


function ViewSingleEvent() {
    const navigate = useNavigate();
    const { id: eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedEvents, setRelatedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventImage, setEventImage] = useState([]);
    const eventPath = `${import.meta.env.VITE_FILE_BASE_URL}`;
    const [wishlistItems, setWishlistItems] = useState([]);

    async function getEvent() {
        try {
            setLoading(true);
            const response = await http.get(`/Event/${eventId}`);
            if (response.status === 200) {
                setEvent(response.data);
                getAllEvents(response.data.eventCategory);
            } else {
                toast.error("Event retrieval failed!");
            }
        } catch (error) {
            toast.error("Event retrieval failed: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function getAllEvents(eventCategory) {
        try {
            if (relatedEvents.length === 0) {
                const response = await http.get(`/Event`);
                if (response.status === 200) {
                    const allEventsResponse = response.data;
                    const sameCategoryEvents = allEventsResponse.filter(e => e.category === eventCategory);

                    const otherEvents = sameCategoryEvents.filter(e => e.id !== Number(eventId));
                    let relatedEventsToShow;

                    if (otherEvents.length < 3) {
                        const remainingEventsCount = 3 - otherEvents.length;
                        const otherCategoriesEvents = allEventsResponse.filter(e => e.category !== eventCategory && e.id !== Number(eventId));
                        const shuffledOtherCategoriesEvents = otherCategoriesEvents.sort(() => 0.5 - Math.random());
                        const additionalEvents = shuffledOtherCategoriesEvents.slice(0, Math.min(remainingEventsCount, shuffledOtherCategoriesEvents.length));
                        relatedEventsToShow = otherEvents.concat(additionalEvents);
                    } else {
                        relatedEventsToShow = otherEvents.slice(0, 3);
                    }

                    console.log("RELATED: ", relatedEventsToShow);
                    console.log("RELATED EVENTS: ", relatedEvents)
                    setRelatedEvents(relatedEventsToShow);
                } else {
                    toast.error("Failed to retrieve events!");
                }
            }
        } catch (error) {
            toast.error("Failed to retrieve events: " + error.message);
        }

    }


    const addToCart = () => {
        http.post('/cart', {
            eventId: event.id,
            quantity: quantity
        })
            .then(response => {
                if (response.status === 200) {
                    toast.success(
                        <span>
                            Event added to cart.{' '}
                            <span
                                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                onClick={() => navigate('/cart')}
                            >
                                Go to Cart
                            </span>
                        </span>
                    );
                } else {
                    toast.error('Error adding event to cart');
                }
            })
            .catch(err => {
                console.error('Error adding event to cart:', err);
                toast.error('Error adding event to cart');
            });
    }

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    }

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    }



    const loadWishlistItems = async () => {
        try {
            const response = await http.get('/wishlist');
            const eventIds = response.data.map(item => item.eventId);
            console.log(wishlistItems)
            setWishlistItems(eventIds);
        } catch (error) {
            console.error('Error loading wishlist items:', error);
        }
    };

    const handleAddToWishlist = async (eventId) => {
        if (wishlistItems.includes(eventId)) {
            handleRemoveFromWishlist(eventId);
        } else {
            try {
                const response = await http.post('/wishlist', { EventId: eventId });
                if (response.status === 200) {
                    setWishlistItems(prevState => [...prevState, eventId]);
                    // Call toast.success with just the message
                    toast.success('Product added to wishlist');
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    toast.error('Error adding product to wishlist: Product might already be in your wishlist or does not exist');
                } else {
                    console.error('Error adding product to wishlist:', error);
                }
            }
        }
    };

    const handleRemoveFromWishlist = async (eventId) => {
        try {
            const response = await http.delete(`/wishlist/${eventId}`, {
                data: { EventId: eventId }, // Pass the data in the `data` property
                headers: { 'Content-Type': 'application/json' } // Explicitly set the Content-Type
            });
            if (response.status === 200) {
                setWishlistItems(prevState => prevState.filter(id => id !== eventId));
                // Call toast.success with just the message
                toast.success('Product removed from wishlist');
            }
        } catch (error) {
            console.error('Error removing product from wishlist:', error);
        }
    };

    useEffect(() => {
        getEvent();
    }, [eventId]);

    useEffect(() => {
        loadWishlistItems();
    }, []);

    return (
        <>
            {event && (
                <Box sx={{ mt: 2 }}>

                    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                        <Container maxWidth="lg">
                            {/* Breadcrumbs and Back Button */}
                            <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
                                <Breadcrumbs aria-label="breadcrumb">
                                    <Link underline="hover" color="inherit" href="/">
                                        Home
                                    </Link>
                                    <Link underline="hover" color="inherit" href="/events">
                                        Events
                                    </Link>
                                    <Typography color="text.primary">{event?.eventName}</Typography>
                                </Breadcrumbs>
                            </Box>

                            {/* Event Title and Details */}
                            <Typography variant="h4" gutterBottom>
                                {event?.eventName}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                {event?.eventCategory} - {event?.eventLocation}
                            </Typography>

                            {/* Main Content */}
                            <Grid container spacing={2}>
                                {/* Left Column: Event Image and Description */}
                                <Grid item xs={12} md={8}>
                                    {/* Image */}
                                    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                                        <Carousel
                                            autoPlay={true}
                                            animation="slide"
                                            indicators={true}
                                            navButtonsAlwaysVisible={true}

                                        >
                                            {event?.eventPicture && JSON.parse(event.eventPicture).map((image, i) => (
                                                <img
                                                    key={i}
                                                    src={`${eventPath}${image}`}
                                                    alt={`Slide ${i + 1}`}
                                                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                                />
                                            ))}
                                        </Carousel>
                                    </Paper>


                                    <Box sx={{ marginTop: 2 }}>
                                        {/* Description */}
                                        <Paper elevation={3} sx={{ p: 2 }}>
                                            <Typography variant="h5" gutterBottom>
                                                Event Description
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 2 }}>
                                                <MDEditor.Markdown style={{ marginTop: "0.5rem", color: "black", backgroundColor: "white" }} source={event?.eventDescription} />
                                            </Typography>
                                        </Paper>
                                    </Box>
                                </Grid>

                                {/* Right Column: Add to Cart or Not on Sale */}
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                                        {event.eventStatus ? (
                                            <>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item container alignItems="center">
                                                        <Typography variant="h5" gutterBottom>
                                                            Book Your Event
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item container alignItems="center">
                                                        <Typography variant="body2" color="text.secondary">
                                                            Date: {new Date(event.eventDate).toLocaleDateString()} - {new Date(event.eventEndDate).toLocaleDateString()}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item container alignItems="center">
                                                        <Typography variant="body2" color="text.secondary">
                                                            Availability: {event.eventStatus ? "Available" : "Not Available"}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item container alignItems="center">
                                                        <Typography variant="body2" color="text.secondary">
                                                            Schedule: Daily
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item container alignItems="center">
                                                        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
                                                            {event.eventSale ? (
                                                                <>
                                                                    <del>${event.eventPrice}</del>
                                                                    &nbsp;
                                                                    <span style={{ color: 'red' }}>${event.eventDiscountPrice}&nbsp;(SALE!)</span>
                                                                </>
                                                            ) : (
                                                                `$${event.eventPrice}`
                                                            )}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} container alignItems="center" >
                                                        <Typography variant="body1">Select Quantity:</Typography>
                                                        <IconButton onClick={decreaseQuantity} disabled={quantity <= 1}>
                                                            <RemoveIcon />
                                                        </IconButton>
                                                        <Typography>{quantity}</Typography>
                                                        <IconButton onClick={increaseQuantity}>
                                                            <AddIcon />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={12}>

                                                        <Box display={"flex"} alignItems={"center"}>
                                                            <Button variant="contained" onClick={addToCart} fullWidth startIcon={<ShoppingCartIcon />}>
                                                                Add to Cart
                                                            </Button>
                                                            <Box>
                                                                <IconButton onClick={() => handleAddToWishlist(event.id)}>
                                                                    {wishlistItems.includes(event.id)
                                                                        ? <FavoriteIcon color="error" />
                                                                        : <FavoriteBorderIcon />}
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ) : (
                                            <Typography variant="h6" color="error">
                                                Not on Sale
                                            </Typography>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Related Events Section */}
                            <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>
                                You might also like...
                            </Typography>
                            <Grid container spacing={4}>

                                {relatedEvents.map((relatedEvent) => (
                                    <Grid item xs={12} sm={6} md={4} key={relatedEvent.id}>
                                        <Card sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={`${eventPath}${JSON.parse(relatedEvent.eventPicture)[0]}`}
                                                alt="Activity Image"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h6" component="div">
                                                    {relatedEvent.eventName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Genre: {relatedEvent.eventCategory}
                                                </Typography
                                                ><Typography variant="body2" color="text.secondary">
                                                    Schedule: {relatedEvent.schedule || 'Daily'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {relatedEvent.eventStatus ? (
                                                        <>
                                                            {relatedEvent.eventSale ? (
                                                                <>
                                                                    <del>${relatedEvent.eventPrice}</del>
                                                                    &nbsp;
                                                                    <span style={{ color: 'red' }}>${relatedEvent.eventDiscountPrice}&nbsp;(SALE!)</span>
                                                                </>
                                                            ) : (
                                                                `$${relatedEvent.eventPrice}`
                                                            )}
                                                        </>
                                                    ) : (
                                                        "Not for sale"
                                                    )}
                                                </Typography>

                                            </CardContent>
                                            <CardActions>
                                                <Button variant="contained" color="primary" fullWidth onClick={() => navigate(`/events/${relatedEvent.id}`)}>View Event</Button>
                                                <Grid item>
                                                    <IconButton onClick={() => handleAddToWishlist(relatedEvent.id)}>
                                                        {wishlistItems.includes(relatedEvent.id)
                                                            ? <FavoriteIcon color="error" />
                                                            : <FavoriteBorderIcon />}
                                                    </IconButton>
                                                </Grid>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>
                    </Paper>
                    {/* Event Review Section */}
                    <EventReviewSmall eventId={eventId} />

                    <ToastContainer />
                </Box>
            )}
        </>
    );
}

export default ViewSingleEvent;
