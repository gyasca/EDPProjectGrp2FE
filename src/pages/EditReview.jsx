// src/pages/EditReview.jsx
import React, { useEffect } from 'react';
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
import CardTitle from "../components/CardTitle";
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditReview = ({ onSubmit }) => {
    const { id } = useParams();
    const formik = useFormik({
        initialValues: {
            rating: '',
            subject: '',
            comment: '',
        },
        validationSchema: Yup.object({
            rating: Yup.number().required('Rating is required').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
            subject: Yup.string().required('Subject is required'),
            comment: Yup.string().required('Comment is required'),
        }),
        onSubmit: values => {
            onSubmit(values);
        },
    });

    useEffect(() => {
        // Fetch review information based on reviewId
        const fetchReview = async () => {
            try {
                const response = await axios.get(`https://localhost:7261/Reviews/${id}`);
                const reviewData = response.data;

                // Set form values with the fetched review data
                formik.setValues({
                    rating: reviewData.rating.toString(), // Assuming rating is a number
                    subject: reviewData.subject,
                    comment: reviewData.comment,
                });
            } catch (error) {
                console.error('Error fetching review data', error);
            }
        };

        fetchReview();
    }, [id, formik]);

    return (
        <>
            <Container maxWidth="xl" sx={{ marginTop: '1rem' }}>
                {/* Your other components and titles go here */}

                {/* Form */}
                <Card sx={{ margin: 'auto' }}>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <CardContent>
                            {/* Form Title */}
                            <CardTitle title="Edit Review" />

                            {/* Form Fields */}
                            <Grid container marginTop={'1rem'} spacing={2}>
                                <Grid item xs={6}>
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
                                <Grid item xs={6}>
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
                                Submit Edit
                            </LoadingButton>
                        </CardContent>
                    </Box>
                </Card>
            </Container>
        </>
    );
};

export default EditReview;
