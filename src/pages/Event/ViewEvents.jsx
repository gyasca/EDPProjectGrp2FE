import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, Checkbox, FormGroup, FormControlLabel, Slider, Paper } from '@mui/material';
import http from '../../http';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewEvents() {
    const [eventList, setEventList] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState({
        'Dine & Wine': false,
        'Family Bonding': false,
        'Hobbies & Wellness': false,
        'Sports & Adventure': false,
        'Travel': false,
    });
    const [priceRange, setPriceRange] = useState([0, 100]); // Assuming a default price range

    const getEvents = () => {
        http.get('/Event')
            .then(response => {
                setEventList(response.data);
                filterEvents(response.data, selectedCategories, priceRange);
            })
            .catch(error => {
                toast.error('Error fetching events: ' + error.message);
            });
    };

    useEffect(() => {
        getEvents();
    }, []);

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
            <Typography variant="h5" sx={{ my: 2 }}>
                Events
            </Typography>
            
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
                                    {renderEventImage(event)}
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
                                        <Button component={Link} to={`/events/${event.id}`} variant="contained" color="primary" sx={{ mt: 1 }}>
                                            View Event
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ViewEvents;
