// TicketDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { Typography, Button } from '@mui/material';


const TicketPageInd = () => {
    // State to store ticket details
    const { id } = useParams();
    const [ticketDetails, setTicketDetails] = useState({
        id: 1,
        subject: 'Sample Ticket',
        description: 'This is a sample ticket description.',
        createdAt: "20 Apr 2005",
        status: 'Pending',
        // Add more ticket details as needed
    });

    // Function to handle ticket acceptance
    const handleAcceptance = () => {
        // Implement logic to update ticket status to "Accepted" in the database
        // You might want to make an API call or use a state management library for this purpose
        console.log('Ticket Accepted');
    };

    useEffect(() => {
        // Simulating an asynchronous request to fetch ticket details by ID
        const fetchTicketDetails = async () => {
            try {
                // Replace the following line with your actual API call
                const response = await fetch(`https://localhost:7261/Tickets/${id}`);
                const data = await response.json();

                // Update ticketDetails state with the fetched data
                setTicketDetails(data);
            } catch (error) {
                console.error('Error fetching ticket details:', error);
            }
        };

        // Call the fetchTicketDetails function
        fetchTicketDetails();
    }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

    return (<Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto', marginTop: '50px' }}>
        <Typography variant="h4" gutterBottom>
            Ticket Details
        </Typography>
        <Typography variant="subtitle1">
            <strong>Ticket ID:</strong> {ticketDetails.id}
        </Typography>
        <Typography variant="subtitle1">
            <strong>Subject:</strong> {ticketDetails.subject}
        </Typography>
        <Typography variant="subtitle1">
            <strong>Description:</strong> {ticketDetails.description}
        </Typography>
        <Typography variant="subtitle1">
            <strong>Created On:</strong> {ticketDetails.createdAt}
        </Typography>
        <Typography variant="subtitle1">
            <strong>Status:</strong> {ticketDetails.status}
        </Typography>

        {ticketDetails.status === 'pending' && (
            <Button variant="contained" color="primary" onClick={handleAcceptance} style={{ marginTop: '20px' }}>
                Accept Ticket
            </Button>
        )}
    </Paper>
    );
};

export default TicketPageInd