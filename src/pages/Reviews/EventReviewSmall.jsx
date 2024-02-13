import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, Paper, Typography, Box, Button } from '@mui/material';
import StarRateRounded from '@mui/icons-material/StarRateRounded';
import { useNavigate } from 'react-router-dom';

function EventReviewSmall({ eventId }) {
    const [reviews, setReviews] = useState([]);
    const [eventAverageRating, setEventAverageRating] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchReviews() {
            try {
                const response = await axios.get(`https://localhost:7261/Reviews`);
                if (response.status === 200) {
                    const eventReviews = response.data.filter((review) => review.eventId == eventId);
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
    }, [eventId]);

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

    return (
        <Paper elevation={3} sx={{ p: 2, my: 2 }}>
            <CardHeader
                title={
                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <StarRateRounded fontSize="inherit" style={{ color: 'orange', fontSize: 18 }} />
                        {eventAverageRating.toFixed(1)}
                    </Typography>
                }
                action={
                    reviews.length > 0 ? (
                        <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/reviews/${eventId}`)}>
                            Show all
                        </Typography>
                    ) : (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate(`/reviews/create/${eventId}`)}
                        >
                            Write Review
                        </Button>
                    )
                }
            />
            {reviews.map((review) => (
                <Paper elevation={3} sx={{ p: 2, my: 2 }} key={review.id}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {getStarIcons(review.rating)}
                            <Typography variant="h6">{review.rating.toFixed(1)}</Typography>
                            <Typography variant="subtitle1">{review.name}</Typography>
                            <Typography variant="caption">{new Date(review.datecreated).toLocaleDateString()}</Typography>
                        </Box>
                        <Typography variant="subtitle1">{review.subject}</Typography>
                        <Typography variant="body2">{review.comment}</Typography>
                    </CardContent>
                </Paper>
            ))}
        </Paper>
    );
}

export default EventReviewSmall;
