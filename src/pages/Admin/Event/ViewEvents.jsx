import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import http from "../../../http";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isActivating, setIsActivating] = useState(true);
    const navigate = useNavigate();

    const fetchEvents = () => {
        setLoading(true);
        http.get('/Admin/Event/')
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                toast.error('Error fetching events: ' + error.message);
            })
            .finally(() => setLoading(false));
    };

    const handleDialogOpen = (event, activating) => {
        setCurrentEvent(event);
        setIsActivating(activating);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleEventStatusChange = () => {
        const statusChange = isActivating ? 'activate' : 'deactivate';
        http.put(`/Admin/Event/${statusChange}/${currentEvent.id}`)
            .then(() => {
                toast.success(`Event successfully ${statusChange}d`);
                fetchEvents();
            })
            .catch(error => {
                toast.error(`Error: Could not ${statusChange} event - ${error.message}`);
            })
            .finally(() => setDialogOpen(false));
    };


    useEffect(() => {
        fetchEvents();
    }, []);

    // Sort events array by ID in descending order
    const sortedEvents = [...events].sort((a, b) => b.id - a.id);

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'eventName', headerName: 'Event Name', width: 200 },
        { field: 'eventCategory', headerName: 'Category', width: 150 },
        { field: 'eventLocation', headerName: 'Location', width: 150 },
        { field: 'eventDate', headerName: 'Date', width: 110 },
        { field: 'eventStatus', headerName: 'Active', width: 100 },
        {
            field: 'actions',
            type: 'actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => navigate(`/admin/events/edit/${params.id}`)}
                />,
                params.row.eventStatus ? (
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Deactivate"
                        onClick={() => handleDialogOpen(params.row, false)}
                    />
                ) : (
                    <GridActionsCellItem
                        icon={<AddIcon />}
                        label="Activate"
                        onClick={() => handleDialogOpen(params.row, true)}
                    />
                ),
            ],
        },
    ];

    const handleAddEventClick = () => {
        navigate('/admin/events/add');
    };

    return (
        <Container maxWidth="lg">
            <ToastContainer />
            <Typography variant="h4" gutterBottom>
                Event Management
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddEventClick}
                style={{ marginBottom: '1rem' }}
            >
                Add Event
            </Button>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                        <DataGrid
                            rows={sortedEvents}
                            columns={columns}
                            pageSize={10}
                            loading={loading}
                            autoHeight
                        />
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{isActivating ? 'Activate' : 'Deactivate'} Event</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to {isActivating ? 'activate' : 'deactivate'} this event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleEventStatusChange} color="primary">
                        {isActivating ? 'Activate' : 'Deactivate'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ViewEvents;
