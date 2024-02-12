import React, { useState, useEffect } from 'react';
import { Paper, Container, Typography, Card, CardContent, Grid, IconButton, Button, Box, CardActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../http';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ViewSingleEvent() {
    const navigate = useNavigate();
    const { id: eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedEvents, setRelatedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getEvent() {
        try {
            setLoading(true);
            const response = await http.get(`/Event/${eventId}`);
            if (response.status === 200) {
                setEvent(response.data);
                setLoading(false);
            } else {
                toast.error("Event retrieval failed!");
                setLoading(false);
            }
        } catch (error) {
            toast.error("Event retrieval failed: " + error.message);
            setLoading(false);
        }
    }

    async function getAllEvents(eventCategory) {
        try {
            const response = await http.get(`/Event`);
            if (response.status === 200) {
                const allEventsResponse = response.data;
                // Filter events by the same category as the current event
                const sameCategoryEvents = allEventsResponse.filter(e => e.category === eventCategory);
                
                // Exclude the current event using its ID
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
    
                setRelatedEvents(relatedEventsToShow);
            } else {
                toast.error("Failed to retrieve events!");
            }
        } catch (error) {
            toast.error("Failed to retrieve events: " + error.message);
        }
    }
    
    useEffect(() => {
        // Call getEvent to fetch the event details
        getEvent();
    }, [eventId]);

    useEffect(() => {
        // Call getAllEvents only after event is fetched and set
        if (event) {
            getAllEvents(event.eventCategory); // Corrected property name to event.eventCategory
        }
    }, [event]); 
    

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

    return (
        <>
            {event && (
                <Box> 
                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: '10px', my: 2, cursor: 'pointer' }} onClick={() => navigate('/events')}>
                        <ArrowBackIcon /> Events
                    </Typography>

                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Container maxWidth="lg">
                            <Grid container spacing={2} sx={{ my: 2 }}>
                                {/* Left Column: Event Description */}
                                <Grid item xs={12} md={8}>
                                    <Typography variant="h3" gutterBottom>
                                        {event.eventName}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        {event.eventDescription}
                                    </Typography>
                                </Grid>

                                {/* Right Column: Add to Cart or Not on Sale */}
                                <Grid item xs={12} md={4}>
                                    <Paper elevation={3} sx={{ p: 2 }}>
                                        {event.eventStatus ? (
                                            <>
                                                <Typography variant="h5" gutterBottom>
                                                    Book Your Event
                                                </Typography>
                                                <Typography variant="h6">Price: ${event.eventPrice}</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Typography variant="body1">Select Quantity:</Typography>
                                                    <IconButton onClick={decreaseQuantity} disabled={quantity <= 1}>
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <Typography>{quantity}</Typography>
                                                    <IconButton onClick={increaseQuantity}>
                                                        <AddIcon />
                                                    </IconButton>
                                                </Box>
                                                <Button variant="contained" onClick={addToCart} sx={{ my: 2 }}>
                                                    Add to Cart
                                                </Button>
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
                                View More Events
                            </Typography>
                            <Grid container spacing={4}>
                                {relatedEvents.map((relatedEvent) => (
                                    <Grid item xs={12} sm={6} md={4} key={relatedEvent.id}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6">{relatedEvent.eventName}</Typography>
                                                <Typography variant="body2">{relatedEvent.eventDescription}</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button onClick={() => navigate(`/events/${relatedEvent.id}`)}>View Details</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>
                    </Paper>
                    <ToastContainer />
                </Box>
            )}
        </>
    );
}

export default ViewSingleEvent;
