import React, { useEffect, useState, useContext } from 'react';
import { Box, Card, CardContent, TextField, Grid, Typography, Divider, MenuItem, Select, FormControl, InputLabel, FormControlLabel, Checkbox } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { CategoryContext } from './EventRouteAdmin';
import MDEditor from '@uiw/react-md-editor'; 
import http from '../../../http';

function EditEvent() {
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { setActivePage } = useContext(CategoryContext);

  useEffect(() => {
    http.get(`/Admin/Event/${eventId}`)
      .then(response => {
        console.log("Fetched Data:", response.data);
        formik.setValues(response.data);
        setMarkdown(response.data.eventDescription);
      })
      .catch(error => {
        console.error("Fetching Error:", error);
        toast.error("Error fetching event details: " + error.message);  
      });
  
    setActivePage(2);
  }, [eventId, setActivePage]);
  

  const handleDescriptionChange = (value) => {
    setMarkdown(value);
    formik.setFieldValue('eventDescription', value);
  };

  const formik = useFormik({
    initialValues: {
      eventName: '',
      eventDescription: '',
      eventCategory: '',
      eventLocation: '',
      eventTicketStock: 0,
      eventPrice: 0,
      eventUplayMemberPrice: 0,
      eventNtucClubPrice: 0,
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
          toast.success('Event successfully updated'); 
          navigate('/admin/events'); 
        })
        .catch(error => {
          toast.error("Error updating event: " + error.response.data.message); 
          setLoading(false);
        });
    },
  });

  return (
    <Box sx={{ marginY: "1rem" }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Edit Event
          </Typography>
          <Divider sx={{ my: 2 }} />
          <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              {/* Basic Information */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">Basic Information</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* Event Name */}
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
                <Grid item xs={12} sm={6}>
                  {/* Event Category */}
                  <FormControl fullWidth>
                    <InputLabel id="eventCategory-label">Event Category</InputLabel>
                    <Select
                      id="eventCategory"
                      name="eventCategory"
                      label="Event Category"
                      value={formik.values.eventCategory}
                      onChange={formik.handleChange}
                      error={formik.touched.eventCategory && Boolean(formik.errors.eventCategory)}
                    >
                      <MenuItem value="" disabled>
                        Select Event Category
                      </MenuItem>
                      {['Dine & Wine', 'Family Bonding', 'Hobbies & Wellness', 'Sports & Adventure', 'Travel'].map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {/* Location and Date */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">Location & Date</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* Event Location */}
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
                <Grid item xs={12} sm={6}>
                  {/* Event Date */}
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
              </Grid>
              {/* Pricing Information */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">Pricing Information</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  {/* Event Ticket Stock */}
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
                <Grid item xs={12} sm={4}>
                  {/* Event Price */}
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
                <Grid item xs={12} sm={4}>
                  {/* Uplay Member Price */}
                  <TextField
                    fullWidth
                    id="eventUplayMemberPrice"
                    name="eventUplayMemberPrice"
                    label="Uplay Member Price"
                    type="number"
                    value={formik.values.eventUplayMemberPrice}
                    onChange={formik.handleChange}
                    error={formik.touched.eventUplayMemberPrice && Boolean(formik.errors.eventUplayMemberPrice)}
                    helperText={formik.touched.eventUplayMemberPrice && formik.errors.eventUplayMemberPrice}
                  />
                </Grid>
              </Grid>
              {/* Event Details */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">Event Details</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* Event Duration */}
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
                <Grid item xs={12} sm={6}>
                  {/* Event Picture URL */}
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
              </Grid>
              {/* Checkboxes */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
            {/* Right Column */}
            <Grid item xs={12} md={6}>
              {/* Event Description */}
              <Typography fontWeight={700} marginBottom={"0.25rem"}>Event Description</Typography>
              <MDEditor
                value={markdown}
                onChange={handleDescriptionChange}
                height={300}
                data-color-mode="light"
                preview="edit"
              />
              {formik.touched.eventDescription && formik.errors.eventDescription && (
                <Typography color="error">{formik.errors.eventDescription}</Typography>
              )}
            </Grid>
          </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EditEvent;
