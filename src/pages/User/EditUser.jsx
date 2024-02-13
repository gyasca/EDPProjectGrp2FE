import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import UserContext from "../../contexts/UserContext";
import AdminPageTitle from "../../components/AdminPageTitle";

function EditUser() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [user, setLocalUser] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [tabValue, setTabValue] = useState(0); // State to manage tab selection
  const { setUser } = useContext(UserContext);

  // Reference for scrolling to specific elements
  const detailsRef = useRef(null);
  const passwordRef = useRef(null);

  // logout after password change
  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  // Configurations for userDetails edit form.
  const handleChangeDate = (dateTime) => {
    userDetailsFormik.setFieldValue("dateOfBirth", dateTime); // Update the "dateOfBirth" field directly with the selected dateTime
  };

  const [imageFile, setImageFile] = useState(null);

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }

      let formData = new FormData();
      formData.append("file", file);
      http
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          setImageFile(res.data.filename);
          setUploadCounter((prevCounter) => prevCounter + 1);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  useEffect(() => {
    // Fetch user details when the component mounts
    console.log(userId);
    http
      .get(`/user/${userId}`)
      .then((response) => {
        setLocalUser(response.data);
        setExistingImage(response.data.profilePhotoFile);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userId]);

  // Formik hook for password change form
  const passwordFormik = useFormik(
    {
      initialValues: {
        password: "",
        confirmPassword: "",
      },
      enableReinitialize: true, // This option allows the form to reinitialize when props (in this case, initialValues) change
      validationSchema: yup.object({
        password: yup
          .string()
          .trim()
          .min(8, "Password must be at least 8 characters")
          // .required("Password is required")
          .matches(
            /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
            "At least 1 letter and 1 number"
          ),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref("password")], "Passwords must match")
          .required("Confirm password is required"),
      }),
      onSubmit: (data) => {
        console.log("Password Form Values:", data);
        // Handle password change submission
        http
          .put(`/user/password/${userId}`, data)
          .then((res) => {
            console.log(res.data);
            logout();
          })
          .catch(function (err) {
            toast.error(`${err.response.data.message}`);
          });
      },
    },
    [user]
  );

  // Formik hook for user details edit form
  const userDetailsFormik = useFormik(
    {
      initialValues: {
        roleName: user?.roleName || "", // Make sure to provide default values
        membershipStatus: user?.membershipStatus || "",
        mobileNumber: user?.mobileNumber || "",
        email: user?.email || "",
        profilePhotoFile: user?.profilePhotoFile || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        gender: user?.gender || "",
        occupationType: user?.occupationType || "",
        address: user?.address || "",
        postalCode: parseInt(user?.postalCode) || "",
        newsletterSubscriptionStatus:
          user?.newsletterSubscriptionStatus || false,
        twoFactorAuthStatus: user?.twoFactorAuthStatus || false,
        verificationStatus: user?.verificationStatus || false,
        googleAccountType: user?.googleAccountType || false,
        dateOfBirth: dayjs(user?.dateOfBirth) || dayjs(new Date()),
      },
      enableReinitialize: true, // This option allows the form to reinitialize when props (in this case, initialValues) change
      validationSchema: yup.object({
        mobileNumber: yup
          .string()
          .matches(/^\d{8}$/, "Mobile Number must be exactly 8 digits"),
        profilePhotoFile: yup.mixed(),
        email: yup
          .string()
          .trim()
          .email("Enter a valid email")
          .max(50, "Email must be at most 50 characters")
          .required("Email is required"),
        firstName: yup
          .string()
          .trim()
          .min(1, "Name must be at least 1 character")
          .max(50, "Name must be at most 50 characters")
          .required("Name is required")
          .matches(
            /^[a-zA-Z '-,.]+$/,
            "Only allow letters, spaces and characters: ' - , ."
          ),
        postalCode: yup
          .string()
          .matches(/^\d{6}$/, "Postal Code must be exactly 6 digits"),
      }),
      onSubmit: (data) => {
        console.log("User Details Form Values:", data);
        // Handle user details edit submission
        // clean input first because need convert some inputs to proper format
        data.mobileNumber = data.mobileNumber.toString();
        data.email = data.email.trim().toLowerCase();
        data.postalCode = data.postalCode.toString();
        if (imageFile) {
          data.profilePhotoFile = imageFile;
        }

        http
          .put(`/user/${userId}`, data)
          .then((res) => {
            console.log(res.data);
            setUser(res.data);
            navigate(`/user/viewspecificuser/${userId}`);
          })
          .catch(function (err) {
            toast.error(`${err.response.data.message}`);
          });
      },
    },
    [user]
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!user) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <Box>
      <AdminPageTitle
        title="Edit User Account"
        subtitle={`Update Details Or Password (Non-Google Authenticated users only)`}
        backbutton
      />

      <Paper elevation={3} sx={{ marginBottom: 2 }}>
        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          centered={false}
          aria-label="user details tabs"
        >
          <Tab label="Change Details" />
          {!userDetailsFormik.values.googleAccountType && (
            <Tab label="Change Password" />
          )}
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <Box hidden={tabValue !== 0}>
        {/* Change Details Panel */}
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Edit User Details
          </Typography>
          <form onSubmit={userDetailsFormik.handleSubmit}>
            <Grid container spacing={2}>
              {/* Form fields for user details */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  label="First Name"
                  name="firstName"
                  value={userDetailsFormik.values.firstName}
                  onChange={userDetailsFormik.handleChange}
                  onBlur={userDetailsFormik.handleBlur}
                  error={
                    userDetailsFormik.touched.firstName &&
                    Boolean(userDetailsFormik.errors.firstName)
                  }
                  helperText={
                    userDetailsFormik.touched.firstName &&
                    userDetailsFormik.errors.firstName
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Last Name"
                  name="lastName"
                  value={userDetailsFormik.values.lastName}
                  onChange={userDetailsFormik.handleChange}
                  onBlur={userDetailsFormik.handleBlur}
                  error={
                    userDetailsFormik.touched.lastName &&
                    Boolean(userDetailsFormik.errors.lastName)
                  }
                  helperText={
                    userDetailsFormik.touched.lastName &&
                    userDetailsFormik.errors.lastName
                  }
                />
              </Grid>
              {/* Other form fields go here */}
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Email"
                  name="email"
                  value={userDetailsFormik.values.email}
                  onChange={userDetailsFormik.handleChange}
                  onBlur={userDetailsFormik.handleBlur}
                  error={
                    userDetailsFormik.touched.email &&
                    Boolean(userDetailsFormik.errors.email)
                  }
                  helperText={
                    userDetailsFormik.touched.email &&
                    userDetailsFormik.errors.email
                  }
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Mobile Number"
                  name="mobileNumber"
                  type="tel"
                  value={userDetailsFormik.values.mobileNumber}
                  onChange={userDetailsFormik.handleChange}
                  onBlur={userDetailsFormik.handleBlur}
                  error={
                    userDetailsFormik.touched.mobileNumber &&
                    Boolean(userDetailsFormik.errors.mobileNumber)
                  }
                  helperText={
                    userDetailsFormik.touched.mobileNumber &&
                    userDetailsFormik.errors.mobileNumber
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+65</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Gender"
                  name="gender"
                  select
                  variant="outlined"
                  value={userDetailsFormik.values.gender}
                  onChange={userDetailsFormik.handleChange}
                  error={
                    userDetailsFormik.touched.gender &&
                    Boolean(userDetailsFormik.errors.gender)
                  }
                  helperText={
                    userDetailsFormik.touched.gender &&
                    userDetailsFormik.errors.gender
                  }
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="prefer-not-to-say">
                    Prefer Not to Say
                  </MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Occupation Type"
                  name="occupationType"
                  select
                  variant="outlined"
                  value={userDetailsFormik.values.occupationType}
                  onChange={userDetailsFormik.handleChange}
                  error={
                    userDetailsFormik.touched.occupationType &&
                    Boolean(userDetailsFormik.errors.occupationType)
                  }
                  helperText={
                    userDetailsFormik.touched.occupationType &&
                    userDetailsFormik.errors.occupationType
                  }
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="employed">Employed</MenuItem>
                  <MenuItem value="unemployed">Unemployed</MenuItem>
                  <MenuItem value="self-employed">Self-Employed</MenuItem>
                </TextField>{" "}
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Address"
                  name="address"
                  value={userDetailsFormik.values.address}
                  onChange={userDetailsFormik.handleChange}
                  onBlur={userDetailsFormik.handleBlur}
                  error={
                    userDetailsFormik.touched.address &&
                    Boolean(userDetailsFormik.errors.address)
                  }
                  helperText={
                    userDetailsFormik.touched.address &&
                    userDetailsFormik.errors.address
                  }
                />{" "}
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Postal Code"
                  name="postalCode"
                  type="number"
                  value={userDetailsFormik.values.postalCode}
                  onChange={userDetailsFormik.handleChange}
                  onBlur={userDetailsFormik.handleBlur}
                  error={
                    userDetailsFormik.touched.postalCode &&
                    Boolean(userDetailsFormik.errors.postalCode)
                  }
                  helperText={
                    userDetailsFormik.touched.postalCode &&
                    userDetailsFormik.errors.postalCode
                  }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Newsletter Subscription Status"
                  name="newsletterSubscriptionStatus"
                  select
                  variant="outlined"
                  value={userDetailsFormik.values.newsletterSubscriptionStatus}
                  onChange={userDetailsFormik.handleChange}
                  error={
                    userDetailsFormik.touched.newsletterSubscriptionStatus &&
                    Boolean(
                      userDetailsFormik.errors.newsletterSubscriptionStatus
                    )
                  }
                  helperText={
                    userDetailsFormik.touched.newsletterSubscriptionStatus &&
                    userDetailsFormik.errors.newsletterSubscriptionStatus
                  }
                >
                  <MenuItem value={true}>Subscribed</MenuItem>
                  <MenuItem value={false}>Not subscribed</MenuItem>
                </TextField>
              </Grid>

              {/* Datepicker field for dateOfBirth */}
              <Grid item xs={12} lg={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Date of Birth"
                    slotProps={{ textField: { fullWidth: true } }}
                    disableFuture
                    value={userDetailsFormik.values.dateOfBirth}
                    onChange={handleChangeDate}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" />
                    )}
                    error={
                      userDetailsFormik.touched.dateOfBirth &&
                      Boolean(userDetailsFormik.errors.dateOfBirth)
                    }
                    helperText={
                      userDetailsFormik.touched.dateOfBirth &&
                      userDetailsFormik.errors.dateOfBirth
                    }
                    sx={{ marginY: "0.5rem" }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Conditional rendering for image upload button and profile photo based on Google logged in */}

              <Grid item xs={12} lg={6}>
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button variant="contained" component="label">
                    Upload Image
                    <input
                      hidden
                      accept="image/*"
                      multiple
                      type="file"
                      onChange={onFileChange}
                    />
                  </Button>
                  <ToastContainer />
                </Box>
              </Grid>
              <Grid item xs={12} lg={6}>
                {userDetailsFormik.values.googleAccountType ? (
                  <Avatar
                    alt="profilephoto"
                    src={user.profilePhotoFile} // Assuming `user` contains the user data including the profile photo for Google authenticated users
                    sx={{
                      width: 200,
                      height: 200,
                      margin: "0 auto 16px auto",
                    }}
                  />
                ) : (
                  <>
                    {imageFile ? (
                      <Avatar
                        alt="profilephoto"
                        src={`${
                          import.meta.env.VITE_FILE_BASE_URL
                        }${imageFile}`}
                        sx={{
                          width: 200,
                          height: 200,
                          margin: "0 auto 16px auto",
                        }}
                      />
                    ) : (
                      <Avatar
                        alt="profilephoto"
                        src={`${
                          import.meta.env.VITE_FILE_BASE_URL
                        }${existingImage}`}
                        sx={{
                          width: 200,
                          height: 200,
                          margin: "0 auto 16px auto",
                        }}
                      />
                    )}
                  </>
                )}
              </Grid>

              <Grid item xs={12} sm={12}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ width: "100%", mt: 2 }}
                >
                  Save User Details
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

      <Box hidden={tabValue !== 1}>
        {/* Change Password Panel */}
        {!userDetailsFormik.values.googleAccountType && (
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Change Password
            </Typography>
            <form onSubmit={passwordFormik.handleSubmit}>
              <Grid container spacing={2}>
                {/* Form fields for changing password */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="New Password"
                    name="password"
                    type="password"
                    value={passwordFormik.values.password}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={
                      passwordFormik.touched.password &&
                      Boolean(passwordFormik.errors.password)
                    }
                    helperText={
                      passwordFormik.touched.password &&
                      passwordFormik.errors.password
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordFormik.values.confirmPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={
                      passwordFormik.touched.confirmPassword &&
                      Boolean(passwordFormik.errors.confirmPassword)
                    }
                    helperText={
                      passwordFormik.touched.confirmPassword &&
                      passwordFormik.errors.confirmPassword
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ width: "100%", mt: 2 }}
                  >
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        )}
      </Box>

      <ToastContainer />
    </Box>
  );
}

export default EditUser;
