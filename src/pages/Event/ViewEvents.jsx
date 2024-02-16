import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, Checkbox, FormGroup, FormControlLabel, Slider, Paper, CardActions, IconButton } from '@mui/material';
import http from '../../http';
import { Link, } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import UserPageTitle from '../../components/UserPageTitle';

function ViewEvents() {
    const [eventList, setEventList] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState({
        'Dine & Wine': false,
        'Family Bonding': false,
        'Hobbies & Wellness': false,
        'Sports & Adventure': false,
        'Travel': false,
    });
    const [priceRange, setPriceRange] = useState([0, 499]);
    const navigate = useNavigate();
    const eventPath = `${import.meta.env.VITE_FILE_BASE_URL}`;


    const getEvents = () => {
        http.get('/Event')
            .then(response => {
                setEventList(response.data);
                filterEvents(response.data, selectedCategories, priceRange);
                console.log(response.data);
            })
            .catch(error => {
                toast.error('Error fetching events: ' + error.message);
            });
    };

    useEffect(() => {
        getEvents();
        loadWishlistItems();
    }, [wishlistItems]);

    const handleCategoryChange = (event) => {
        setSelectedCategories({
            ...selectedCategories,
            [event.target.name]: event.target.checked,
        });
    };

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    useEffect(() => {
        filterEvents(eventList, selectedCategories, priceRange);
    }, [selectedCategories, priceRange]);

    const filterEvents = (events, categories, prices) => {
        const filtered = events.filter(event => {
            const categoryMatch = categories[event.eventCategory] || Object.values(categories).every(v => !v);
            const priceMatch = (event.eventPrice >= prices[0] && (prices[1] === 500 ? event.eventPrice > 500 : event.eventPrice <= prices[1]));
            return categoryMatch && priceMatch;
        });
        setFilteredEvents(filtered);
    };


    const loadWishlistItems = async () => {
        try {
            const response = await http.get('/wishlist');
            const eventIds = response.data.map(item => item.eventId);
            setWishlistItems(eventIds);
            console.log(eventIds)
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
                    toast.success('Product added to wishlist');
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    toast.error('Error adding product to wishlist: Product might already be in your wishlist or does not exist', error);
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
                toast.success('Product removed from wishlist', sucess);
            }
        } catch (error) {
            console.error('Error removing product from wishlist:', error);
        }
    };
    

    const renderEventImage = (event) => {
        // This should be the actual URL to the image related to the event
        const imageUrl = event.imageUrl || 'src/assets/yishun.jpg'; // Placeholder for image source
        return (
            <CardMedia
                component="img"
                height="140"
                image={imageUrl}
                alt="Activity Image"
            />
        );
    };

    return (
        <Box>
            <UserPageTitle title="Events" />

            <Grid container spacing={2}>
                {/* Category checkboxes and Price range slider */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Categories
                        </Typography>
                        <FormGroup sx={{ display: 'flex', flexDirection: 'column' }}>
                            {Object.keys(selectedCategories).map((category) => (
                                <FormControlLabel
                                    key={category}
                                    control={
                                        <Checkbox
                                            checked={selectedCategories[category]}
                                            onChange={handleCategoryChange}
                                            name={category}
                                        />
                                    }
                                    label={category}
                                />
                            ))}
                        </FormGroup>
                        {/* Price range slider */}
                        <Typography gutterBottom>
                            Price Range
                        </Typography>
                        <Slider
                            value={priceRange}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={500}
                        />
                        <Typography>
                            {`$${priceRange[0]} - ${priceRange[1] === 500 ? '500+' : `$${priceRange[1]}`}`}
                        </Typography>
                    </Paper>
                </Grid>


                {/* Displaying filtered events */}
                <Grid item xs={12} md={9}>
                    <Grid container spacing={2}>
                        {filteredEvents.map((event, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={`${eventPath}${JSON.parse(event.eventPicture)[0]}`}
                                        alt="Activity Image"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {event.eventName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Schedule: {event.schedule || 'Daily'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Price: ${event.eventPrice}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Genre: {event.eventCategory}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button variant="contained" color="primary" fullWidth onClick={() => navigate(`/events/${event.id}`)}>View Event</Button>
                                        <Grid item>
                                            <IconButton onClick={() => handleAddToWishlist(event.id)}>
                                                {wishlistItems.includes(event.id)
                                                    ? <FavoriteIcon color="error" />
                                                    : <FavoriteBorderIcon />}
                                            </IconButton>
                                        </Grid>
                                    </CardActions>
                                </Card>

                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
            <ToastContainer />

        </Box >
    );
}

export default ViewEvents;
