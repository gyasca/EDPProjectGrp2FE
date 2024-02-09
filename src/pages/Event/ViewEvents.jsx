import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import http from '../../http';


function ViewEvents() {
    const [eventList, setEventList] = useState([]);

    const getEvents = () => {
        http.get('/Event')
            .then(response => {
                setEventList(response.data);
                console.log(response.data)
            })
            .catch(error => {
                enqueueSnackbar('Error fetching events: ' + error.message, { variant: 'error' });
            })
    };

    useEffect(() => {
        getEvents();
    }, []);


    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Events
            </Typography>

            <Grid container spacing={2}>
                {
                    eventList.map((event, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={event.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {event.eventName}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {event.eventDescription}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}

export default ViewEvents;