import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import http from '../../http';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

function ViewEvents() {
    const [eventList, setEventList] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    // Define your categories
    const categories = ['All Categories', 'Dine & Wine', 'Family Bonding', 'Hobbies & Wellness', 'Sports & Adventure', 'Travel'];

    const getEvents = () => {
        http.get('/Event')
            .then(response => {
                setEventList(response.data);
                setFilteredEvents(response.data); 
            })
            .catch(error => {
                toast.error('Error fetching events: ' + error.message);
            });
    };

    useEffect(() => {
        getEvents();
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        if (category === 'All Categories') {
            setFilteredEvents(eventList);
        } else {
            setFilteredEvents(eventList.filter(event => event.eventCategory === category));
        }
    };

    // Placeholder for renderEventImage function
    // Replace with your actual image rendering logic
    const renderEventImage = (event) => {
        const placeholderImageUrl = 'https://via.placeholder.com/150'; // Replace with actual placeholder image if needed
        return (
            <div style={{ backgroundImage: `url(${placeholderImageUrl})`, height: '200px', backgroundSize: 'cover', position: 'relative' }}>
                {/* Add any overlay or content here */}
            </div>
        );
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Events
            </Typography>
            
            {/* Category buttons */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {categories.map((category) => (
                    <Chip 
                        key={category} 
                        label={category} 
                        onClick={() => handleCategorySelect(category)} 
                        color={selectedCategory === category ? 'primary' : 'default'} // Highlight selected category
                        clickable 
                    />
                ))}
            </Box>

            <Grid container spacing={2}>
                {filteredEvents.map((event) => (
                    <Grid item xs={12} md={6} lg={4} key={event.id}>
                        <Card sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}>
                            {renderEventImage(event)}
                            <CardContent>
                                <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {event.eventName}
                                    </Typography>
                                </Box>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {event.eventDescription}
                                </Typography>
                                {/* Flex container for price and button */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                    <Typography variant="h6" color="textSecondary">
                                        Price: ${event.eventPrice}
                                    </Typography>
                                    <Button component={Link} to={`/events/${event.id}`} variant="contained" color="primary">
                                        View Event
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ViewEvents;
