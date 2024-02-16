import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, CardMedia, Box, Link, CardActions, IconButton } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import http from '../http';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';



function Home() {
  const [eventList, setEventList] = useState([]);
  const eventPath = `${import.meta.env.VITE_FILE_BASE_URL}`;
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();



  const getEvents = () => {
    http.get('/Event')
      .then(response => {
        setEventList(response.data);
        console.log(response.data);
      })
      .catch(error => {
        toast.error('Error fetching events: ' + error.message);
      });
  };

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
    getEvents();
    loadWishlistItems();
  }, []);


  return (
    <div>
      {/* Secondary Navigation (App Bar) */}
      <AppBar position="sticky" color="default" sx={{ top: "80px", borderRadius: "0px", boxShadow: 15 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
          <Button variant="contained" sx={{ borderRadius: '20px', margin: '0 10px' }}>All Categories</Button>
          <Button variant="contained" sx={{ borderRadius: '20px', margin: '0 10px' }}>Dine & Wine</Button>
          <Button variant="contained" sx={{ borderRadius: '20px', margin: '0 10px' }}>Family Bonding</Button>
          <Button variant="contained" sx={{ borderRadius: '20px', margin: '0 10px' }}>Hobbies & Wellness</Button>
          <Button variant="contained" sx={{ borderRadius: '20px', margin: '0 10px' }}>Sports & Adventure</Button>
          <Button variant="contained" sx={{ borderRadius: '20px', margin: '0 10px' }}>Travel</Button>
        </Toolbar>
      </AppBar>

      {/* Carousel/Slider */}
      <Container sx={{ marginTop: '2rem', maxWidth: '1500px' }}>
        <Carousel
          indicators={false}
          autoPlay={true}
          infiniteLoop
          animation="slide"
          timeout={500}
          navButtonsAlwaysVisible={true}
          navButtonsProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.5)' } }}
          style={{ maxHeight: '500px', borderRadius: 15 }}
        >
          <Box>
            {/* Placeholder for Carousel/Slider Images */}
            <img src="src\assets\wildwet2.jpg" alt="www2" style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }} />
          </Box>
          <Box>
            {/* Placeholder for Carousel/Slider Images */}
            <img src="src\assets\snowcity.jpg" alt="snowcity" style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }} />
          </Box>
          <Box>
            {/* Placeholder for Carousel/Slider Images */}
            <img src="src\assets\adcove.jpg" alt="adcove" style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }} />
          </Box>
        </Carousel>
      </Container>


      {/* About UPlay Section */}
      <Container sx={{ marginTop: '2rem' }}>
        <Typography variant="h4">About UPlay</Typography>
        <Typography variant="h6" sx={{ fontStyle: 'italic', fontWeight: 'medium', marginTop: '1rem' }}>
          You Play, We'll Do The Rest
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '1rem' }}>
          UPlay, powered by NTUC Club, is a phygital (physical + digital) concierge of curatorial recreation experiences to enhance the social well-being of all workers. More than just a booking platform, UPlay aspires to connect people from all walks of life, forging new relationships over time as they find a common thread through shared interests. Union and companies can also join us in creating fun and engaging communities while cultivating deep connections and lifelong relationships.
        </Typography>
        <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }}>Find out more here</Button>
      </Container>

      {/* Awesome Experiences Section */}
      <Container sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Typography variant="h4">Awesome Experiences</Typography>
        <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
          {/* Placeholder for 8 activity cards */}
          {eventList.map(event => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
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
                    Genre: {event.eventCategory}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Schedule: {event.schedule || 'Daily'}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {event.eventStatus ? (
                      <>
                        {event.eventSale ? (
                          <>
                            <del>${event.eventPrice}</del>
                            &nbsp;
                            <span style={{ color: 'red' }}>${event.eventDiscountPrice}&nbsp;(SALE!)</span>
                          </>
                        ) : (
                          `$${event.eventPrice}`
                        )}
                      </>
                    ) : (
                      "Not for sale"
                    )}
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
      </Container>
    </div>
  );
}

export default Home;
