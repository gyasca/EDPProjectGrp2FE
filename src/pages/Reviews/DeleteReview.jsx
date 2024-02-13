import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// import StarRateRounded from '@mui/icons-material/StarRateRounded';

const DeleteReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await axios.get(`https://localhost:7261/Reviews/${id}`);

                if (response.status === 200) {
                    setReview(response.data);
                } else {
                    console.error('Failed to fetch review', response.status);
                }
            } catch (error) {
                console.error('Error fetching review', error.message, error.response?.data);
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [id]);

    const handleDeleteReview = async () => {
        // You can add a check to ensure the user wants to delete the review, similar to the dialog in the existing component

        try {
            const response = await axios.delete(`https://localhost:7261/Reviews/${id}`);

            if (response.status === 204) {
                console.log('Review deleted successfully');
                navigate("/reviews");
            } else {
                console.error('Failed to delete review', response.status);
            }
        } catch (error) {
            console.error('Error deleting review', error.message, error.response?.data);
        }
    }

    const handleOpenDeleteDialog = () => {
        setDeleteDialogOpen(true);
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
    }

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            {loading ? (
                <Typography variant="h4">Loading...</Typography>
            ) : review ? (
                <>
                    <Typography variant="h4">Delete Review</Typography>

                    {/* Confirmation Dialog for Deleting */}
                    <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
                        <DialogTitle>Delete Review</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this review?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                            <Button onClick={handleDeleteReview} color="error">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Button to open the delete confirmation dialog */}
                    <Button onClick={handleOpenDeleteDialog} color="error">
                        Delete
                    </Button>

                    {/* Display the review information */}
                    <Typography variant="h5">{review.title}</Typography>
                    <Typography variant="body1">{review.content}</Typography>
                    <Typography variant="body1">
                        Rating: {review.rating}
                    </Typography>
                    <Typography variant="body1">
                        Subject: {review.subject}
                    </Typography>
                    <Typography variant="body1">
                        Comment: {review.comment}
                    </Typography>
                </>
            ) : (
                <Typography variant="h4">Review not found</Typography>
            )}
        </Paper>
    );
};

export default DeleteReview;