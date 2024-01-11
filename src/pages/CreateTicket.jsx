import React from 'react';
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
import { useNavigate } from 'react-router-dom';

const CreateTicket = ({ onSubmit }) => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            subject: '',
            description: '',
            status: '',
        },
        validationSchema: Yup.object({
            subject: Yup.string().required('Subject is required'),
            description: Yup.string().required('Description is required'),
            status: Yup.string().required('Description is required'),
        }),
        onSubmit: async values => {
            try {
                const response = await axios.post('https://localhost:7261/Tickets', values);

                if (response.status === 201) {
                    // Review added successfully, you can perform additional actions if needed
                    console.log('Ticket added successfully');
                    navigate("/tickets")

                    // Call the provided onSubmit callback
                    onSubmit(values);
                } else {
                    console.error('Failed to add ticket', response.status);
                }
            } catch (error) {
                console.error('Error adding ticket', error.message, error.response?.data);
            }
        },
    });

    return (
        <>
            <Container maxWidth="xl" sx={{ marginTop: '1rem' }}>
                {/* Your other components and titles go here */}

                {/* Form */}
                <Card sx={{ margin: 'auto' }}>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <CardContent>
                            {/* Form Title */}
                            <CardTitle title="Create Ticket" />

                            {/* Form Fields */}
                            <Grid container marginTop={'1rem'} spacing={2}>
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
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        id="description"
                                        name="description"
                                        label="Description"
                                        variant="outlined"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        error={formik.touched.description && Boolean(formik.errors.description)}
                                        helperText={formik.touched.description && formik.errors.description}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="status"
                                        name="status"
                                        label="Status"
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        value={formik.values.status}
                                        onChange={formik.handleChange}
                                        error={formik.touched.status && Boolean(formik.errors.status)}
                                        helperText={formik.touched.status && formik.errors.status}
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
                                Add Ticket
                            </LoadingButton>
                        </CardContent>
                    </Box>
                </Card>
            </Container>
        </>
    );
};

export default CreateTicket;
