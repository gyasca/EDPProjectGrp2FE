import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

export function CheckoutSuccessful() {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="lg" sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 4
      }}> 
        <Box
          sx={{
            backgroundColor: '#f3f3f3',
            padding: 4,
            borderRadius: 4,
            textAlign: 'center',
            width: '100%',
            height: '50vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CheckCircleIcon color="success" sx={{ fontSize: 200 }} />
          <Typography variant="h4" gutterBottom>
            We have received your request #ZP03.
          </Typography>
          <Typography variant="subtitle1">
            We would contact via email shortly.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ marginTop: 4 }}
          >
            Go to Orders
          </Button>
        </Box>
    </Container>
  );
}
