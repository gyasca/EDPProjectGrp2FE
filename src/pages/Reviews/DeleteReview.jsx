import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditReviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const handleDeleteReview = async () => {
        try {
            const response = await axios.delete(`https://localhost:7261/Reviews/${id}`);

            if (response.status === 204) {
                // Review deleted
                console.log('Review deleted successfully');
                navigate("/reviews")

            } else {
                console.error('Failed to delete review', response.status);
            }
        } catch (error) {
            console.error('Error deleting review', error.message, error.response?.data);
        }
    }
    return (
        <div>
            <h1>Delete Review</h1>

            {/* Link back to the Reviews page */}
            <Link to="/reviews">Back to Reviews</Link>

            {/* Form for Editing a Review */}
            <Button onClick={handleDeleteReview}>Delete</Button>
        </div>
    );
};

export default EditReviewPage;