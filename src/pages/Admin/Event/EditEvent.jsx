import React, { useEffect, useState, useContext } from 'react';
import { Box, Card, CardContent, TextField, FormControlLabel, Checkbox, Grid, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { CategoryContext } from './EventRouteAdmin';
import http from '../../../http';

function EditEvent() {
  const [loading, setLoading] = useState(false);
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setActivePage } = useContext(CategoryContext);

  useEffect(() => {
    http.get(`/Admin/Event/${eventId}`)
      .then(response => {
        console.log("Fetched Data:", response.data);
        formik.setValues(response.data);
      })
      .catch(error => {
        console.error("Fetching Error:", error);
        enqueueSnackbar("Error fetching event details: " + error.message, { variant: "error" });
      });
  
    setActivePage(2);
  }, [eventId, enqueueSnackbar, setActivePage]);
  

  const formik = useFormik({
    initialValues: {
      eventName: '',
      eventDescription: '',
      eventCategory: '',
      eventLocation: '',
      eventTicketStock: 0,
      eventUplayMemberPrice: 0,
      eventNtucClubPrice: 0,
      ntucClubPrice: 0,
      eventDate: '',
      eventDuration: 0,
      eventSale: false,
      eventStatus: false,
      eventPicture: '',
    },
    validationSchema: Yup.object({
      eventName: Yup.string().required('Event Name is required'),
      eventDescription: Yup.string().required('Event Description is required'),
      eventCategory: Yup.string().required('Event Category is required'),
      eventLocation: Yup.string().required('Event Location is required'),
      eventTicketStock: Yup.number().min(1).required('Ticket Stock is required'),
      eventPrice: Yup.number().min(0).required('Event Price is required'),
      eventUplayMemberPrice: Yup.number().min(0).max(999),
      eventNtucClubPrice: Yup.number().min(0).max(999),
      eventDate: Yup.date().required('Event Date is required'),
      eventDuration: Yup.number().min(1).required('Event Duration is required'),
      eventSale: Yup.boolean(),
      eventStatus: Yup.boolean(),
      eventPicture: Yup.string(),
    }),
    onSubmit: (values) => {
      setLoading(true);
      http.put(`/Admin/Event/${eventId}`, values)
        .then(response => {
          console.log(values)
          enqueueSnackbar('Event successfully updated', { variant: 'success' });
          navigate('/admin/events'); 
        })
        .catch(error => {
          enqueueSnackbar("Error updating event: " + error.response.data.message, { variant: "error" });
          setLoading(false);
        });
    },
  });

  return (
    <>
      <Box sx={{ marginY: "1rem" }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Edit Event
            </Typography>
            <Box component="form" mt={3} onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                {/* Event Name */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="eventName"
                    name="eventName"
                    label="Event Name"
                    value={formik.values.eventName}
                    onChange={formik.handleChange}
                    error={formik.touched.eventName && Boolean(formik.errors.eventName)}
                    helperText={formik.touched.eventName && formik.errors.eventName}
                  />
                </Grid>
                {/* Event Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="eventDescription"
                    name="eventDescription"
                    label="Event Description"
                    multiline
                    rows={4}
                    value={formik.values.eventDescription}
                    onChange={formik.handleChange}
                    error={formik.touched.eventDescription && Boolean(formik.errors.eventDescription)}
                    helperText={formik.touched.eventDescription && formik.errors.eventDescription}
                  />
                </Grid>
                {/* Event Category */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="eventCategory"
                    name="eventCategory"
                    label="Event Category"
                    value={formik.values.eventCategory}
                    onChange={formik.handleChange}
                    error={formik.touched.eventCategory && Boolean(formik.errors.eventCategory)}
                    helperText={formik.touched.eventCategory && formik.errors.eventCategory}
                  />
                </Grid>
                {/* Event Location */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="eventLocation"
                    name="eventLocation"
                    label="Event Location"
                    value={formik.values.eventLocation}
                    onChange={formik.handleChange}
                    error={formik.touched.eventLocation && Boolean(formik.errors.eventLocation)}
                    helperText={formik.touched.eventLocation && formik.errors.eventLocation}
                  />
                </Grid>
                {/* Event Ticket Stock */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="eventTicketStock"
                    name="eventTicketStock"
                    label="Event Ticket Stock"
                    type="number"
                    value={formik.values.eventTicketStock}
                    onChange={formik.handleChange}
                    error={formik.touched.eventTicketStock && Boolean(formik.errors.eventTicketStock)}
                    helperText={formik.touched.eventTicketStock && formik.errors.eventTicketStock}
                  />
                </Grid>
                {/* Event Price */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="eventPrice"
                    name="eventPrice"
                    label="Event Price"
                    type="number"
                    value={formik.values.eventPrice}
                    onChange={formik.handleChange}
                    error={formik.touched.eventPrice && Boolean(formik.errors.eventPrice)}
                    helperText={formik.touched.eventPrice && formik.errors.eventPrice}
                  />
                </Grid>
                {/* Uplay Member Price */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="eventUplayMemberPrice"
                    name="eventUplayMemberPrice"
                    label="Uplay Price"
                    type="number"
                    value={formik.values.eventUplayMemberPrice}
                    onChange={formik.handleChange}
                    error={formik.touched.eventUplayMemberPrice && Boolean(formik.errors.eventUplayMemberPrice)}
                    helperText={formik.touched.eventUplayMemberPrice && formik.errors.eventUplayMemberPrice}
                  />
                </Grid>
                {/* NTUC Club Price */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="eventNtucClubPrice"
                    name="eventNtucClubPrice"
                    label="NTUC Club Price"
                    type="number"
                    value={formik.values.eventNtucClubPrice}
                    onChange={formik.handleChange}
                    error={formik.touched.eventNtucClubPrice && Boolean(formik.errors.eventNtucClubPrice)}
                    helperText={formik.touched.eventNtucClubPrice && formik.errors.eventNtucClubPrice}
                  />
                </Grid>
                {/* Event Date */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="eventDate"
                    name="eventDate"
                    label="Event Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values.eventDate}
                    onChange={formik.handleChange}
                    error={formik.touched.eventDate && Boolean(formik.errors.eventDate)}
                    helperText={formik.touched.eventDate && formik.errors.eventDate}
                  />
                </Grid>
                {/* Event Duration */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="eventDuration"
                    name="eventDuration"
                    label="Event Duration (in hours)"
                    type="number"
                    value={formik.values.eventDuration}
                    onChange={formik.handleChange}
                    error={formik.touched.eventDuration && Boolean(formik.errors.eventDuration)}
                    helperText={formik.touched.eventDuration && formik.errors.eventDuration}
                  />
                </Grid>
                {/* Event Sale */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.eventSale}
                        onChange={formik.handleChange}
                        name="eventSale"
                      />
                    }
                    label="Event Sale"
                  />
                </Grid>
                {/* Event Status */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.eventStatus}
                        onChange={formik.handleChange}
                        name="eventStatus"
                      />
                    }
                    label="Event Status"
                  />
                </Grid>
                {/* Event Picture */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="eventPicture"
                    name="eventPicture"
                    label="Event Picture URL"
                    value={formik.values.eventPicture}
                    onChange={formik.handleChange}
                    error={formik.touched.eventPicture && Boolean(formik.errors.eventPicture)}
                    helperText={formik.touched.eventPicture && formik.errors.eventPicture}
                  />
                </Grid>
                {/* Submit Button */}
                <Grid item xs={12}>
                  <LoadingButton
                    color="primary"
                    variant="contained"
                    fullWidth
                    type="submit"
                    loading={loading}
                  >
                    Edit Event
                  </LoadingButton>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default EditEvent;
