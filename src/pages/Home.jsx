import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, CardMedia, Box, Link } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function Home() {
  return (
    <div>
      {/* Secondary Navigation (App Bar) */}
      <AppBar position="sticky" color="default" sx={{top: "80px", borderRadius: "0px", boxShadow: 15}}>
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
            navButtonsProps={{style: {backgroundColor: 'rgba(255, 255, 255, 0.5)'}}}
            style={{maxHeight: '500px', borderRadius: 15}}
        >
            <Box>
            {/* Placeholder for Carousel/Slider Images */}
            <img src="src\assets\wildwet2.jpg" alt="www2" style={{width: '100%', maxHeight: '600px', objectFit: 'cover'}} />
            </Box>
            <Box>
            {/* Placeholder for Carousel/Slider Images */}
            <img src="src\assets\snowcity.jpg" alt="snowcity" style={{width: '100%', maxHeight: '600px', objectFit: 'cover'}} />
            </Box>
            <Box>
            {/* Placeholder for Carousel/Slider Images */}
            <img src="src\assets\adcove.jpg" alt="adcove" style={{width: '100%', maxHeight: '600px', objectFit: 'cover'}} />
            </Box>
        </Carousel>
        </Container>


      {/* About UPlay Section */}
      <Container sx={{ marginTop: '2rem'}}>
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
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image="src\assets\yishun.jpg"  // Placeholder for image
                  alt="Activity Image"
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    Activity {index + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Schedule: Daily
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: $20
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Genre: All Categories
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default Home;
