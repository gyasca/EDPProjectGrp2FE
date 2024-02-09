import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, Grid, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../http';
import { useSnackbar } from 'notistack';

function ViewSingleEvent() {
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const { id: eventId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);


    async function getEvent() {
        try {
            setLoading(true);
            const response = await http.get(`/Event/${eventId}`);
            if (response.status === 200) {
                setEvent(response.data);
                setLoading(false);
            } else {
                enqueueSnackbar("Event retrieval failed!", { variant: "error" });
                setLoading(false);
            }
        } catch (error) {
            enqueueSnackbar("Event retrieval failed: " + error.message, { variant: "error" });
            setLoading(false);
        }
    }

    useEffect(() => {
        getEvent();
    }, []);


    return (
        <>
            <Box sx={{ marginY: "1rem" }}>

            {event && (
                <Container maxWidth="lg">
                    <Card>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="h5">{event.eventName}</Typography>
                                    <Typography variant="body1">{event.eventDescription}</Typography>
                                    <Typography variant="body2">Location: {event.eventLocation}</Typography>
                                    <Typography variant="body2">Date: {new Date(event.eventDate).toLocaleDateString()}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                </Container>
            )}
            </Box>
        </>
    );
}

export default ViewSingleEvent;
