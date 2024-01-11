import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Chip, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, fabClasses } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbarExport } from '@mui/x-data-grid';
import { useNavigate, Link } from 'react-router-dom';
import { Visibility } from '@mui/icons-material';

const TicketPage = () => {
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch reviews from your ASP.NET MVC API
        axios.get('https://localhost:7261/Tickets')
            .then(response => setTickets(response.data))
            .catch(error => console.error('Error fetching tickets:', error));
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'subject', headerName: 'Subject', width: 150 },
        { field: 'description', headerName: 'Description', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 },
        {
            field: 'actions', type: 'actions', width: 80, getActions: (params) => [
                <GridActionsCellItem
                    icon={<Visibility />}
                    label="View Ticket Details"
                    onClick={() => {
                        navigate("/tickets")
                    }}
                />,
            ]
        },
    ];

    return (
        <Container>
            <div><h1>Tickets Pending</h1></div>

            <Link to="/tickets/create">Create Ticket</Link>

            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={tickets} columns={columns} pageSize={5} />
            </div>
        </Container>

    );
};

export default TicketPage;
