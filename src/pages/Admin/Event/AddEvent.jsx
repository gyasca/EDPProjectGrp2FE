import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Box, Card, CardContent, TextField, Grid, Typography, Divider, MenuItem, Select, FormControl, InputLabel, FormControlLabel, Checkbox, Tab, Tabs, Button, CardMedia, IconButton, useMediaQuery, CardActions,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import http from '../../../http';
import { ToastContainer, toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import ReorderIcon from '@mui/icons-material/Reorder';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import AdminPageTitle from "../../../components/AdminPageTitle";



function AddEvent() {
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const isSmallerScreen = useMediaQuery('(max-width:600px)');
  const [eventFiles, setEventFiles] = useState([]);
  const [eventFileUploads, setEventFileUploads] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    initAutocomplete();
  }, []);

  async function initAutocomplete() {
    await new Promise(resolve => {
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_APP_GMAP_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      }
    });

    const autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('eventLocation'), {
      fields: ['formatted_address', 'geometry'], // Specify the fields to return
      types: ['establishment'], // Only show address predictions
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry) {
        window.alert(`No details available for input: '${place.name}'`);
        return;
      }

      formik.setFieldValue('eventLocation', place.formatted_address);
    });
  }


  const handleChangeEventImage = e => {
    const fileList = Array.from(e.target.files);
    const totalImages = eventFiles.length + fileList.length;

    if (totalImages > 5) {
      enqueueSnackbar("You can only upload a maximum of 5 images.", { variant: "warning" });
      return;
    }

    setEventFiles(prevFiles => [...prevFiles, ...fileList.map(file => URL.createObjectURL(file))]);
    setEventFileUploads(prevFiles => [...prevFiles, ...fileList]);
    enqueueSnackbar("Successfully uploaded event pictures.", { variant: "success" });
  };

  function handleDeleteImage(index) {
    const updatedFiles = [...eventFiles];
    updatedFiles.splice(index, 1);
    setEventFiles(updatedFiles);

    const updatedFileUploads = [...eventFileUploads];
    updatedFileUploads.splice(index, 1);
    setEventFileUploads(updatedFileUploads);

    enqueueSnackbar("Image deleted successfully.", { variant: "success" });
  }


  function handleMoveBackward(index) {
    const updatedFiles = [...eventFiles];
    [updatedFiles[index - 1], updatedFiles[index]] = [updatedFiles[index], updatedFiles[index - 1]];
    setEventFiles(updatedFiles);
  }

  function handleMoveForward(index) {
    const updatedFiles = [...eventFiles];
    [updatedFiles[index], updatedFiles[index + 1]] = [updatedFiles[index + 1], updatedFiles[index]];
    setEventFiles(updatedFiles);
  }

  const formik = useFormik({
    initialValues: {
      eventName: '',
      eventDescription: '',
      eventCategory: '',
      eventLocation: '',
      eventTicketStock: 0,
      eventPrice: 0,
      eventDiscountPrice: 0,
      eventUplayMemberPrice: 0,
      eventNtucClubPrice: 0,
      eventDate: '',
      eventEndDate: '',
      eventDuration: 0,
      eventSale: false,
      eventStatus: true,
      eventPicture: '',
    },
    validationSchema: Yup.object({
      eventName: Yup.string().required('Event Name is required'),
      eventDescription: Yup.string().required('Event Description is required'),
      eventCategory: Yup.string().required('Event Category is required'),
      eventLocation: Yup.string().required('Event Location is required'),
      eventTicketStock: Yup.number().min(1).required('Ticket Stock is required'),
      eventPrice: Yup.number().min(0).required('Event Price is required'),
      eventDiscountPrice: Yup.number().min(0),
      eventUplayMemberPrice: Yup.number().min(0),
      eventNtucClubPrice: Yup.number().min(0),
      eventDate: Yup.date().required('Event Date is required'),
      eventEndDate: Yup.date().required('Event End Date is required'),
      eventDuration: Yup.number().min(1).required('Event Duration is required'),
      eventSale: Yup.boolean(),
      eventStatus: Yup.boolean(),
      eventPicture: Yup.string(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {


        if (eventFiles.length === 0) {
          enqueueSnackbar("No files selected for upload.", { variant: "error" });
          return;
        }

        let formData = new FormData();
        eventFileUploads.forEach((file) => {
          formData.append('files', file);
        });


        const uploadResponse = await http.post('/file/multiUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (uploadResponse.status === 200) {

          values.eventPicture = JSON.stringify(uploadResponse.data.uploadedFiles);

          const response = await http.post('/Admin/Event', values);

          if (response.status === 200) {
            toast.success('Event successfully created');
            navigate('/admin/events');
          }
        }
      } catch (error) {
        // Handle errors
        if (error.response) {
          console.error("Error creating event: ", error.response ? error.response.data : error);
          toast.error("Error creating event: " + error.response.data.message);
        } else if (error.request) {
          toast.error("No response received from the server");
        } else {
          console.error("Error creating event: ", error.response ? error.response.data : error);
          toast.error("Error creating event: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDescriptionChange = value => {
    setMarkdown(value);
    formik.setFieldValue('eventDescription', value);
  };

  return (
    <Container
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ marginY: "1rem" }} component="form">
        <Card>
          <CardContent>
            <AdminPageTitle title="Create New Event" subtitle={`Creation of event`} backbutton />

            <LoadingButton
              startIcon={<AddIcon />}
              color="primary"
              variant="contained"
              loading={loading}
              onClick={formik.handleSubmit}
            >
              Create Event
            </LoadingButton>
            <Divider sx={{ my: 1 }} />
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="event tabs"
            >
              <Tab icon={<CategoryIcon />} iconPosition="start" label="Event Information" />
              <Tab icon={<ReorderIcon />} iconPosition="start" label="Event Description" />
              <Tab icon={<ImageIcon />} iconPosition="start" label="Event Images" />
            </Tabs>
            {tabValue === 0 && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography fontWeight={700} marginTop={"1.25rem"} marginBottom={"1.25rem"}>Basic Information</Typography>
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
                        {!isSmallerScreen && (
                          <Typography fontWeight={700} marginTop={"1.25rem"} marginBottom={"1.25rem"}>&nbsp;</Typography>
                        )}
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
                      <Grid item xs={12} sm={12}>
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
                        <TextField
                          fullWidth
                          id="eventDate"
                          name="eventDate"
                          label="Event Start Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={formik.values.eventDate}
                          onChange={formik.handleChange}
                          error={formik.touched.eventDate && Boolean(formik.errors.eventDate)}
                          helperText={formik.touched.eventDate && formik.errors.eventDate}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="eventEndDate"
                          name="eventEndDate"
                          label="Event End Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={formik.values.eventEndDate}
                          onChange={formik.handleChange}
                          error={formik.touched.eventEndDate && Boolean(formik.errors.eventEndDate)}
                          helperText={formik.touched.eventEndDate && formik.errors.eventEndDate}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
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
                      <Grid item xs={12} sm={6}>
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
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="eventDiscountPrice"
                          name="eventDiscountPrice"
                          label="Discount Price"
                          type="number"
                          value={formik.values.eventDiscountPrice}
                          onChange={formik.handleChange}
                          error={formik.touched.eventDiscountPrice && Boolean(formik.errors.eventDiscountPrice)}
                          helperText={formik.touched.eventDiscountPrice && formik.errors.eventDiscountPrice}
                        />
                      </Grid>
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
                              checked={true}
                              onChange={formik.handleChange}
                              name="eventStatus"
                            />
                          }
                          label="Event Status"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            )}
            {tabValue === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Typography fontWeight={700} marginTop={"1.25rem"} marginBottom={"1.25rem"}>Event Description</Typography>
                  <MDEditor
                    value={markdown}
                    onChange={handleDescriptionChange}
                    height={400}
                    data-color-mode="light"
                    preview="edit"
                  />
                  {formik.touched.eventDescription && formik.errors.eventDescription && (
                    <Typography color="error">{formik.errors.eventDescription}</Typography>
                  )}
                </Grid>
              </Grid>
            )}
            {tabValue === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={8}>
                  <Typography fontWeight={700} marginTop={"1.25rem"} marginBottom={"1.25rem"}>Event Images</Typography>
                  <Grid container spacing={3}>
                    {eventFiles.map((file, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                          <CardMedia>
                            <img src={file} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </CardMedia>
                          <CardActions>
                            <IconButton onClick={() => handleDeleteImage(index)}><DeleteIcon /></IconButton>
                            {index > 0 && <IconButton onClick={() => handleMoveBackward(index)}><ArrowBackIcon /></IconButton>}
                            {index < eventFiles.length - 1 && <IconButton onClick={() => handleMoveForward(index)}><ArrowForwardIcon /></IconButton>}
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                {/* Render button below event images if there are no images */}
                {eventFiles.length === 0 && (<>
                  <Grid item xs={12} sm={4}>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button variant="contained" component="label" fullWidth>
                      Upload Event Images
                      <input hidden accept="image/*" onChange={handleChangeEventImage} multiple type="file" />
                    </Button>
                  </Grid>
                </>)}
                <Grid item xs={12} sm={4}>
                  {eventFiles.length > 0 && (
                    <>
                      {!isSmallerScreen && (
                        <Typography fontWeight={700} marginTop={"1.25rem"} marginBottom={"1.25rem"}>&nbsp;</Typography>
                      )}
                      <Button variant="contained" component="label" fullWidth>
                        Upload Event Images
                        <input hidden accept="image/*" onChange={handleChangeEventImage} multiple type="file" />
                      </Button>
                    </>
                  )}

                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Box>
      <ToastContainer />

    </Container>
  );
}

export default AddEvent;
