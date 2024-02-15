import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from 'react-router-dom';

export function CheckoutError() {
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
          <ErrorIcon color="error" sx={{ fontSize: 200 }} />
          <Typography variant="h4" gutterBottom>
            Something went wrong.
          </Typography>
          <Typography variant="subtitle1">
            We were unable to process your request.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ marginTop: 4 }}
          >
            Try Again
          </Button>
        </Box>
    </Container>
  );
}
