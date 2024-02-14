// src/pages/ReviewsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Chip, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, fabClasses } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbarExport } from '@mui/x-data-grid';
import { useNavigate, Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Visibility } from '@mui/icons-material';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch reviews from your ASP.NET MVC API
        axios.get('https://localhost:7261/Reviews')
            .then(response => setReviews(response.data))
            .catch(error => console.error('Error fetching reviews:', error));
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Username', width: 150 },
        { field: 'subject', headerName: 'Subject', flex: 1},
        { field: 'comment', headerName: 'Comment', flex: 1 },
        { field: 'rating', headerName: 'Rating', flex: 1},
        {
            field: 'actions', type: 'actions', width: 80, getActions: (params) => [
                <GridActionsCellItem
                    icon={<Visibility />}
                    label="View Review Details"
                    onClick={() => {
                        navigate("/reviews")
                    }}
                />,
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit Review"
                    onClick={() => {
                        navigate("/reviews/edit/" + params.row.id)
                    }}
                    showInMenu
                />
                ,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete Review"
                    onClick={() => {
                        console.log("Delete Review")
                        navigate("/reviews/delete/" + params.row.id)
                    }}
                    showInMenu
                />,

            ]
        },
    ];

    return (
        <Container>
            <div><h1>Reviews for Activity</h1></div>

            <Link to="/reviews/create">Create Review</Link>

            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={reviews} columns={columns} pageSize={5} />
            </div>
        </Container>

    );
};

export default ReviewsPage;
