import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Chip, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, fabClasses } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbarExport } from '@mui/x-data-grid';
import { useNavigate, Link } from 'react-router-dom';
import { Visibility } from '@mui/icons-material';
import { format } from 'date-fns';

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
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'subject', headerName: 'Subject', flex: 0.5 },
        { field: 'description', headerName: 'Description', flex: 1 },
        {
            field: 'createdAt',
            headerName: 'Created At',
            flex: 0.5,
            valueGetter: (params) => {
                const formattedDate = format(new Date(params.row.createdAt), 'HH:mm dd/MM');
                return formattedDate;
            },
        },
        { field: 'status', headerName: 'Status', flex: 1 },
        { field: 'createdBy', headerName: 'Created By', flex: 0.5 },
        { field: 'acceptedBy', headerName: 'Accepted By', flex: 0.5 },
        {
            field: 'actions', type: 'actions', flex: 1, getActions: (params) => [
                <GridActionsCellItem
                    icon={<Visibility />}
                    label="View Ticket Details"
                    onClick={() => {
                        navigate("/admin/tickets/" + params.row.id)
                    }}
                />,
            ]
        },
    ];

    return (
        <Container>
            <div><h1>Customer Support Tickets</h1></div>

            {/* <Link to="/tickets/create">Create Ticket</Link> */}

            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={tickets} columns={columns} pageSize={5} />
            </div>
        </Container>

    );
};

export default TicketPage;
