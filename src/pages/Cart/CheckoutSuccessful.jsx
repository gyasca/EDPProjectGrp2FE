import React, {useState, useEffect} from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import http from "../../http";

export function CheckoutSuccessful() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    http.get('/User/auth')
          .then(response => {
              setUser(response.data.user);
          })
          .catch(error => {
              console.error('Error fetching user information:', error);
              setError('Unable to fetch user information.');
          });
  }, []);
  
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
            We have received your order.
          </Typography>
          <Typography variant="subtitle1">
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/user/viewspecificuser/'+user.id)}
            sx={{ marginTop: 4 }}
          >
            Go to Orders
          </Button>
        </Box>
    </Container>
  );
}
