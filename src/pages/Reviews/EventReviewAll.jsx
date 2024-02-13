import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Paper, Box, Button } from '@mui/material';
import StarRateRounded from '@mui/icons-material/StarRateRounded';
import { useParams, useNavigate } from 'react-router-dom';

function EventReviewAll() {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [eventAverageRating, setEventAverageRating] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('id:', id);
        async function fetchReviews() {
            try {
                const response = await axios.get(`https://localhost:7261/Reviews`);

                if (response.status === 200) {
                    const eventReviews = response.data.filter((review) => review.eventId == id);
                    setReviews(eventReviews);
                    const totalRating = eventReviews.reduce((sum, review) => sum + review.rating, 0);
                    setEventAverageRating(totalRating / eventReviews.length);
                } else {
                    console.log("Failed to retrieve reviews!");
                }
            } catch (error) {
                console.log("Failed to retrieve reviews: " + error.message);
            }
        }

        fetchReviews();
    }, [id]);

    function getStarIcons(rating) {
        const fullStarCount = Math.floor(rating);
        const halfStarCount = rating % 1 > 0 ? 1 : 0;
        const emptyStarCount = 5 - fullStarCount - halfStarCount;

        const fullStars = Array(fullStarCount).fill(null).map((_, index) => (
            <StarRateRounded key={index} style={{ color: 'orange', fontSize: 18 }} />
        ));
        const halfStar = <StarRateRounded key="half" style={{ color: 'orange', fontSize: 18 }} />;
        const emptyStars = Array(emptyStarCount).fill(null).map((_, index) => (
            <StarRateRounded key={5 - index} style={{ fontSize: 18 }} />
        ));

        return [...fullStars, halfStar, ...emptyStars];
    }

    if (!reviews.length) {
        return <div>No reviews available for this event.</div>;
    }

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    // Use navigate to go to the "Write Review" page with the event ID
                    navigate(`/reviews/create/${id}`);
                }}
                sx={{ float: 'right', mb: 2, mt: 2, mr: 2 }} // Adjust the margin as needed
            >
                Write Review
            </Button>
            <Paper elevation={3} sx={{ p: 2, my: 2, pt: 4 }}> {/* Add padding at the top (pt) */}
                {reviews.map((review) => (
                    <Paper elevation={3} sx={{ p: 2, my: 2 }} key={review.eventId}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {getStarIcons(review.rating)}
                                <Typography variant="h6">{review.rating.toFixed(1)}</Typography>
                                <Typography variant="subtitle1">{review.name}</Typography>
                                <Typography variant="caption">
                                    {new Date(review.datecreated).toLocaleDateString()}
                                </Typography>
                            </Box>
                            <Typography variant="subtitle1">{review.subject}</Typography>
                            <Typography variant="body2">{review.comment}</Typography>
                        </CardContent>
                    </Paper>
                ))}
            </Paper>
        </div>
    );
}

export default EventReviewAll;