// TicketDetailsPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { Typography, Button } from '@mui/material';
import axios from 'axios';
import UserContext from "../../../contexts/UserContext";

const TicketPageInd = () => {
    // State to store ticket details
    const navigate = useNavigate();
    const { id } = useParams();
    const [ticketDetails, setTicketDetails] = useState({
        id: 1,
        subject: 'Sample Ticket',
        description: 'This is a sample ticket description.',
        createdAt: "20 Apr 2005",
        status: 'Pending'
        // Add more ticket details as needed
    });

    // Function to handle ticket acceptance
    const { user } = useContext(UserContext)
    const handleAcceptance = async () => {
        try {
            const updateStatusEndpoint = `https://localhost:7261/Tickets/${id}`; // Replace with the actual API endpoint

            // Define the request payload
            const requestData = {
                status: 'Accepted',
                acceptedBy: user.id,
                subject: ticketDetails.subject,
                description: ticketDetails.description,
            };

            // Send the PUT request using Axios
            const response = await axios.put(updateStatusEndpoint, requestData);

            if (response.status === 204) {
                console.log('Ticket Accepted');
                navigate("/tickets/chat/"+id);

                // Add any additional logic after successful acceptance
            } else {
                throw new Error('Failed to update ticket status');
            }
        } catch (error) {
            console.error('Error updating ticket status:', error.message);
            // Add error handling logic if needed
        }
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
        <Typography variant="subtitle1">
            <strong>Created By:</strong> {ticketDetails.createdBy}
        </Typography>
        <Typography variant="subtitle1">
            <strong>Accepted By:</strong> {ticketDetails.acceptedBy}
        </Typography>
        {/* <Typography variant="subtitle1">
            <strong>Response Type:</strong> {ticketDetails.responseType}
        </Typography> */}

        {ticketDetails.status === 'Pending' && (
            <Button variant="contained" color="primary" onClick={handleAcceptance} style={{ marginTop: '20px' }}>
                Accept Ticket
            </Button>
        )}
    </Paper>
    );
};

export default TicketPageInd