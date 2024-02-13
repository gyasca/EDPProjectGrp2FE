import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
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
  const { setUser } = useContext(UserContext);

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
  // State to track the number of uploads
  const [uploadCounter, setUploadCounter] = useState(0);

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

  if (!user) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0rem",
        alignItems: "start", // Align items at the top
      }}
    >
      <AdminPageTitle
        title="Edit User Account"
        subtitle={`Update Details Or Password (Non-Google Authenticated users only)`}
        backbutton
      />
      <Typography></Typography>
      {/* Edit User Details Form */}
      <Box
        component="form"
        sx={{ maxWidth: "500px" }}
        onSubmit={userDetailsFormik.handleSubmit}
      >
        <Typography variant="h6">Edit User Details</Typography>

        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
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
            userDetailsFormik.touched.email && userDetailsFormik.errors.email
          }
        />
        {/* <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Change Password"
          name="password"
          type="password"
          value={userDetailsFormik.values.password}
          onChange={userDetailsFormik.handleChange}
          onBlur={userDetailsFormik.handleBlur}
          error={userDetailsFormik.touched.password && Boolean(userDetailsFormik.errors.password)}
          helperText={userDetailsFormik.touched.password && userDetailsFormik.errors.password}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Confirm new Password"
          name="confirmPassword"
          type="password"
          value={userDetailsFormik.values.confirmPassword}
          onChange={userDetailsFormik.handleChange}
          onBlur={userDetailsFormik.handleBlur}
          error={
            userDetailsFormik.touched.confirmPassword &&
            Boolean(userDetailsFormik.errors.confirmPassword)
          }
          helperText={
            userDetailsFormik.touched.confirmPassword && userDetailsFormik.errors.confirmPassword
          }
        /> */}

        {/* <TextField
          fullWidth
          id="roleName"
          name="roleName"
          label="Role Name"
          select
          variant="outlined"
          value={userDetailsFormik.values.roleName}
          onChange={userDetailsFormik.handleChange}
          error={userDetailsFormik.touched.roleName && Boolean(userDetailsFormik.errors.roleName)}
          helperText={userDetailsFormik.touched.roleName && userDetailsFormik.errors.roleName}
          sx={{ marginY: "1rem" }}
        >
          <MenuItem value="employee-master">Employee (Master)</MenuItem>
          <MenuItem value="employee-normal">Employee (Normal)</MenuItem>
          <MenuItem value="customer">Customer</MenuItem>
        </TextField> */}

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

        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
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
            userDetailsFormik.touched.gender && userDetailsFormik.errors.gender
          }
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="prefer-not-to-say">Prefer Not to Say</MenuItem>
          <MenuItem value="others">Others</MenuItem>
        </TextField>

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
        </TextField>

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
        />

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
            Boolean(userDetailsFormik.errors.newsletterSubscriptionStatus)
          }
          helperText={
            userDetailsFormik.touched.newsletterSubscriptionStatus &&
            userDetailsFormik.errors.newsletterSubscriptionStatus
          }
        >
          <MenuItem value={true}>Subscribed</MenuItem>
          <MenuItem value={false}>Not subscribed</MenuItem>
        </TextField>

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
        {userDetailsFormik.values.googleAccountType ? (
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                height: "200px",
                width: "200px",
                borderRadius: "50%",
                overflow: "hidden",
                textAlign: "center",
                mt: 2,
              }}
            >
              {/* Display user's profile photo as circular image */}
              <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                <img
                  alt="profilephoto"
                  src={`${
                    userDetailsFormik.values.profilePhotoFile
                  }`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Box>
          </Grid>
        ) : (
          <>
            {/* Render image upload button */}
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
            {/* Display uploaded image or existing image */}
            <Grid item xs={12} lg={6}>
              <Box
                sx={{
                  height: "200px",
                  width: "200px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  textAlign: "center",
                  mt: 2,
                }}
              >
                {imageFile ? (
                  <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                    <img
                      alt="profilephoto"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ) : (
                  existingImage && (
                    <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                      <img
                        alt="profilephoto"
                        src={`${
                          import.meta.env.VITE_FILE_BASE_URL
                        }${existingImage}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )
                )}
              </Box>
            </Grid>
          </>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 5 }}
          type="submit"
        >
          Save User Details
        </Button>
      </Box>

      {/* Render password change form only if googleAccountType is false */}
      {!userDetailsFormik.values.googleAccountType && (
        <>
          {/* Change Password Form */}
          <Box
            component="form"
            sx={{ maxWidth: "500px" }}
            onSubmit={passwordFormik.handleSubmit}
          >
            <Typography variant="h6">Change Password</Typography>
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
            <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
              Change Password
            </Button>
          </Box>
        </>
      )}

      <ToastContainer />
    </Box>
  );
}

export default EditUser;
