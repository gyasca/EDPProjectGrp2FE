// src/pages/CreateReviewForm.jsx
import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CardTitle from "../../components/CardTitle";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import UserContext from "../../contexts/UserContext";

const CreateReview = ({ onSubmit, eventId }) => {
    const navigate = useNavigate();
    var { user } = useContext(UserContext);
    const formik = useFormik({
        initialValues: {
            name: user.firstName,
            rating: '',
            subject: '',
            comment: '',
            eventId: '',
            createdAt: new Date().toISOString(),
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            rating: Yup.number()
                .required('Rating is required')
                .min(1, 'Rating must be at least 1')
                .max(5, 'Rating must be at most 5'),
            subject: Yup.string().required('Subject is required'),
            comment: Yup.string().required('Comment is required'),
        }),
        onSubmit: async (values) => {
            try {
                const reviewData = { ...values, eventId }; // Add eventId to the review data
                const response = await axios.post('https://localhost:7261/Reviews', reviewData);

                if (response.status === 201) {
                    // Review added successfully, you can perform additional actions if needed
                    console.log('Review added successfully');
                    navigate('/events');

                    // Call the provided onSubmit callback
                    onSubmit(reviewData);
                } else {
                    console.error('Failed to add review', response.status);
                }
            } catch (error) {
                console.error('Error adding review', error.message, error.response?.data);
            }
        },
    });

    return (
        <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
            <Card sx={{ margin: 'auto' }}>
                <form onSubmit={formik.handleSubmit}>
                    <CardContent>
                        <CardTitle title="Write a Review" />

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="rating"
                                    name="rating"
                                    label="Rating"
                                    variant="outlined"
                                    type="number"
                                    value={formik.values.rating}
                                    onChange={formik.handleChange}
                                    error={formik.touched.rating && Boolean(formik.errors.rating)}
                                    helperText={formik.touched.rating && formik.errors.rating}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">/5</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="subject"
                                    name="subject"
                                    label="Subject"
                                    variant="outlined"
                                    value={formik.values.subject}
                                    onChange={formik.handleChange}
                                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                                    helperText={formik.touched.subject && formik.errors.subject}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="comment"
                                    name="comment"
                                    label="Comment"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={formik.values.comment}
                                    onChange={formik.handleChange}
                                    error={formik.touched.comment && Boolean(formik.errors.comment)}
                                    helperText={formik.touched.comment && formik.errors.comment}
                                />
                            </Grid>
                        </Grid>

                        {/* Submit Button */}
                        <LoadingButton
                            variant="contained"
                            color="primary"
                            type="submit"
                            loading={formik.isSubmitting}
                            loadingPosition="start"
                            startIcon={<AddIcon />}
                            sx={{ marginTop: '1rem' }}
                        >
                            Add Review
                        </LoadingButton>
                    </CardContent>
                </form>
            </Card>
        </Container>
    );
};

export default CreateReview;