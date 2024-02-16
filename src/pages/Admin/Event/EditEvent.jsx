import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Box, Card, CardContent, TextField, Grid, Typography, Divider, MenuItem, Select, FormControl, InputLabel, FormControlLabel, Checkbox, Tab, Tabs, Button, CardMedia, IconButton, useMediaQuery, CardActions,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import http from '../../../http';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import ImageIcon from '@mui/icons-material/Image';
import ReorderIcon from '@mui/icons-material/Reorder';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import AdminPageTitle from "../../../components/AdminPageTitle";

function EditEvent() {
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const isSmallerScreen = useMediaQuery('(max-width:600px)');
  const [tabValue, setTabValue] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [eventFiles, setEventFiles] = useState([]);
  const [eventFileUploads, setEventFileUploads] = useState([]);
  const [eventFileNewUploads, setEventFileNewUploads] = useState([]);
  const [allEventFiles, setAllEventFiles] = useState([]);
  const eventPath = `${import.meta.env.VITE_FILE_BASE_URL}`

  function getEvent() {
    http.get(`/Admin/Event/${eventId}`)
      .then(response => {
        console.log("Fetched Data:", response.data);
        formik.setValues(response.data);
        setMarkdown(response.data.eventDescription);

        let filenames = [];
        if (typeof response.data.eventPicture === 'string') {
          const trimmedString = response.data.eventPicture.replace(/[\[\]"]+/g, '');
          filenames = trimmedString.split(',');
        } else if (Array.isArray(response.data.eventPicture)) {
          filenames = response.data.eventPicture;
        }

        setEventFiles(filenames.map(filename => `${filename}`));
      })
      .catch(error => {
        console.error("Fetching Error:", error);
        toast.error("Error fetching event details: " + error.message);
      });

  }

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

  useEffect(() => {
    getEvent();
    initAutocomplete();
  }, [eventId]);

  useEffect(() => {
    setAllEventFiles([...eventFiles, ...eventFileNewUploads]);
  }, [eventFileNewUploads, eventFiles]);

  function handleDeleteImage(index) {
    const deletedFile = allEventFiles[index];
    const updatedFiles = [...allEventFiles];
    updatedFiles.splice(index, 1);
    setAllEventFiles(updatedFiles);

    if (eventFileNewUploads.includes(deletedFile)) {
      const fileNewUploadsIndex = eventFileNewUploads.indexOf(deletedFile);
      const updatedFileNewUploads = [...eventFileNewUploads];
      updatedFileNewUploads.splice(fileNewUploadsIndex, 1);
      setEventFileNewUploads(updatedFileNewUploads);

      URL.revokeObjectURL(deletedFile);

      const updatedFileUploads = [...eventFileUploads];
      updatedFileUploads.splice(fileNewUploadsIndex, 1);
      setEventFileUploads(updatedFileUploads);

      enqueueSnackbar("Image deleted successfully.", { variant: "success" });
    }
  }

  function handleChangeEventImage(e) {
    const fileList = Array.from(e.target.files);
    if (allEventFiles.length + fileList.length > 5) {
      enqueueSnackbar("You can only upload a maximum of 5 images.", { variant: "warning" });
      return; // exit the function early
    }
    setEventFileNewUploads(prevFiles => [...prevFiles, ...fileList.map(file => URL.createObjectURL(file))]);
    setEventFileUploads(prevFiles => [...prevFiles, ...fileList]);
  }

  function handleMoveBackward(index) {

    const updatedAllFiles = [...allEventFiles];
    [updatedAllFiles[index - 1], updatedAllFiles[index]] = [updatedAllFiles[index], updatedAllFiles[index - 1]];
    setAllEventFiles(updatedAllFiles);

    const updatedUploads = [...eventFileUploads];
    for (let i = 0; i < updatedAllFiles.length; i++) {
      if (typeof updatedAllFiles[i] === 'string' && !updatedUploads[i]) {
        updatedUploads.splice(i, 0, null);
      }
    }
    [updatedUploads[index - 1], updatedUploads[index]] = [updatedUploads[index], updatedUploads[index - 1]];
    var updatedUpload1s = updatedUploads.filter(item => item !== null);
    setEventFileUploads(updatedUpload1s);
  }

  function handleMoveForward(index) {

    const updatedAllFiles = [...allEventFiles];
    [updatedAllFiles[index], updatedAllFiles[index + 1]] = [updatedAllFiles[index + 1], updatedAllFiles[index]];
    setAllEventFiles(updatedAllFiles);

    const updatedUploads = [...eventFileUploads];
    for (let i = 0; i < updatedAllFiles.length; i++) {
      if (typeof updatedAllFiles[i] === 'string' && !updatedUploads[i]) {
        updatedUploads.splice(i, 0, null);
      }
    }
    [updatedUploads[index], updatedUploads[index + 1]] = [updatedUploads[index + 1], updatedUploads[index]];
    var updatedUpload1s = updatedUploads.filter(item => item !== null);
    setEventFileUploads(updatedUpload1s);
  }


  const handleDescriptionChange = (value) => {
    setMarkdown(value);
    formik.setFieldValue('eventDescription', value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
    onSubmit: (values) => {
      setLoading(true);

      if (eventFileUploads.length > 0) {
        let formData = new FormData();

        eventFileUploads.forEach((file) => {
          formData.append('files', file);
        });

        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        http.post('/file/multiUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((response) => {
            console.log("Uploaded Images:", response.data.uploadedFiles);
            const newFilenames = response.data.uploadedFiles;
            const combinedEventFiles = allEventFiles.map(file => {
              if (file.startsWith('blob:http://') && newFilenames.length > 0) {
                return newFilenames.shift();
              }
              return file;
            });
            if (newFilenames.length > 0) {
              combinedEventFiles.push(...newFilenames);
            }
            values.eventPicture = JSON.stringify(combinedEventFiles);
            console.log("Event Picture:", values.eventPicture);

            http.put(`/Admin/Event/${eventId}`, values)
              .then(response => {
                toast.success('Event successfully updated');
                navigate('/admin/events');
              })
              .catch(error => {
                toast.error("Error updating event: " + error.response.data.message);
                setLoading(false);
              });
          })
          .catch(error => {
            console.log("Error uploading images:",
              error.response?.data?.message || error.message
            );

            toast.error("Error uploading images: " + error.response.data.message);
            setLoading(false);
          });
      } else {
        values.eventPicture = JSON.stringify(allEventFiles);

        http.put(`/Admin/Event/${eventId}`, values)
          .then(response => {
            toast.success('Event successfully updated');
            navigate('/admin/events');
          })
          .catch(error => {
            toast.error("Error updating event: " + error.response.data.message);
            setLoading(false);
          });
      }

    },
  });

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
            <AdminPageTitle title="Edit Event" subtitle={`Editing of event`} backbutton />

            <LoadingButton
              startIcon={<AddIcon />}
              color="primary"
              variant="contained"
              loading={loading}
              onClick={formik.handleSubmit}
            >
              Edit Event
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
                          value={formik.values.eventDate ? new Date(formik.values.eventDate).toISOString().split('T')[0] : ''}
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
                          value={formik.values.eventEndDate ? new Date(formik.values.eventEndDate).toISOString().split('T')[0] : ''}
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
                              checked={formik.values.eventStatus}
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Typography fontWeight={700} marginTop={"1.25rem"} marginBottom={"1.25rem"}>Event Images</Typography>
                  <Grid container spacing={3}>
                    {allEventFiles.map((file, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                          <CardMedia >
                            <img
                              src={eventFileNewUploads.includes(file) ? file : `${eventPath}${file}`}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </CardMedia>
                          <CardActions>
                            <IconButton onClick={() => handleDeleteImage(index)}><DeleteIcon /></IconButton>
                            {index > 0 && <IconButton onClick={() => handleMoveBackward(index)}><ArrowBackIcon /></IconButton>}
                            {index < allEventFiles.length - 1 && <IconButton onClick={() => handleMoveForward(index)}><ArrowForwardIcon /></IconButton>}
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid xs={12} sm={4}>
                  {!isSmallerScreen && (
                    <Typography fontWeight={700} marginTop={"1.25rem"} marginBottom={"1.25rem"}>&nbsp;</Typography>
                  )}
                  <Button variant="contained" component="label" fullWidth>
                    Upload Event Image
                    <input hidden accept="image/*" onChange={handleChangeEventImage} multiple type="file" />
                  </Button>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default EditEvent;
