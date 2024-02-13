import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import http from "../../../http";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import AdminPageTitle from "../../../components/AdminPageTitle";
import UserContext from "../../../contexts/UserContext";

function EditUser() {
  const navigate = useNavigate();
  const { userId, adminId } = useParams();
  const [user, setLocalUser] = useState(null);
  const { setUser } = useContext(UserContext);
  const [existingImage, setExistingImage] = useState(null);
  // more variable declarations below (config for user details form)

  useEffect(() => {
    // Fetch user details when the component mounts
    console.log(userId);
    http
      .get(`/user/${userId}`)
      .then((response) => {
        setLocalUser(response.data);
        setExistingImage(response.data.profilePhotoFile); // Update existingImage state
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userId]);

  // userDetailsFormik hook for password change form
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
            navigate(`/viewspecificuser/${userId}`);
          })
          .catch(function (err) {
            toast.error(`${err.response.data.message}`);
          });
      },
    },
    [user]
  );

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

  // userDetailsFormik hook for user details edit form
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
            if (userId === adminId) {
              setUser(res.data);
            }
            navigate(`/admin/users/allusers`);
          })
          .catch(function (err) {
            toast.error(`${err.response.data.message}`);
          });

        console.log("id of user who got edited: ", userId);
        console.log("id of admin who is editing user: ", adminId);
        // http
        //   .get(`/user/${adminId}`)
        //   .then((response) => {
        //     console.log(response.data);
        //     setLocalUser(response.data);
        //     setUser(response.data);
        //     navigate(`/admin/users/allusers`);
        //   })
        //   .catch((error) => {
        //     console.error("Error fetching user details:", error);
        //   });
      },
    },
    [user]
  );

  if (!user) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <Container>
      <AdminPageTitle title="Edit User" subtitle={`Admin`} backbutton />
      {/* Edit User Details Form */}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          {/* Content for the first half of the grid */}
          <Box
            component="form"
            sx={{ maxWidth: "500px" }}
            onSubmit={userDetailsFormik.handleSubmit}
          >
            <Typography variant="h5">Edit Details</Typography>
            {/* <input
          type="file"
          onChange={(event) =>
            userDetailsFormik.setFieldValue(
              "profilePhotoFile",
              event.currentTarget.files[0]
            )
          }
          onBlur={userDetailsFormik.handleBlur}
          error={
            userDetailsFormik.touched.profilePhotoFile &&
            Boolean(userDetailsFormik.errors.profilePhotoFile)
          }
          helperText={
            userDetailsFormik.touched.profilePhotoFile && userDetailsFormik.errors.profilePhotoFile
          }
        /> */}
            <Grid container spacing={2} sx={{}}>
              <Grid item xs={12} lg={6}>
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
              </Grid>
              <Grid item xs={12} lg={6}>
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
              </Grid>
              <Grid item xs={12}>
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

              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Membership Status"
                  name="membershipStatus"
                  select
                  variant="outlined"
                  value={userDetailsFormik.values.membershipStatus}
                  onChange={userDetailsFormik.handleChange}
                  error={
                    userDetailsFormik.touched.membershipStatus &&
                    Boolean(userDetailsFormik.errors.membershipStatus)
                  }
                  helperText={
                    userDetailsFormik.touched.membershipStatus &&
                    userDetailsFormik.errors.membershipStatus
                  }
                >
                  <MenuItem value={"member"}>Member</MenuItem>
                  <MenuItem value={"non-member"}>Non Member</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} lg={6}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Mobile Number"
                  name="mobileNumber"
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

              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12} lg={12}>
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

              <Grid item xs={12} lg={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="Role Name"
                  name="roleName"
                  select
                  variant="outlined"
                  value={userDetailsFormik.values.roleName}
                  onChange={userDetailsFormik.handleChange}
                  error={
                    userDetailsFormik.touched.roleName &&
                    Boolean(userDetailsFormik.errors.roleName)
                  }
                  helperText={
                    userDetailsFormik.touched.roleName &&
                    userDetailsFormik.errors.roleName
                  }
                >
                  <MenuItem value="employee-master">Employee (Master)</MenuItem>
                  <MenuItem value="employee-normal">Employee (Normal)</MenuItem>
                  <MenuItem value="customer">Customer</MenuItem>
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
                </TextField>
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

              <Grid item xs={12} lg={6}>
                {/* Conditionally render upload image button */}
                {!user?.googleAccountType && (
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
                )}
              </Grid>
              <Grid item xs={12} lg={6}>
                {user.googleAccountType ? (
                  <Avatar
                    alt="profilephoto"
                    src={user.profilePhotoFile}
                    sx={{ width: 200, height: 200, margin: "0 auto 16px auto" }}
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
            </Grid>

            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Date of Birth"
            // slotProps={{
            //   textField: {
            //     helperText: "MM/DD/YYYY",
            //   },
            // }}
            slotProps={{ textField: { fullWidth: true } }}
            value={userDetailsFormik.values.dateOfBirth}
            onChange={handleChangeDate}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" />
            )}
            error={
              userDetailsFormik.touched.dateOfBirth && Boolean(userDetailsFormik.errors.dateOfBirth)
            }
            helperText={userDetailsFormik.touched.dateOfBirth && userDetailsFormik.errors.dateOfBirth}
            sx={{ marginY: "1rem" }}
            dateOfBirth
          />
        </LocalizationProvider> */}

            <Button
              fullWidth
              variant="contained"
              sx={{ mb: 5, mt: 2 }}
              type="submit"
            >
              Save User Details
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} lg={6}>
          {/* Content for the second half of the grid */}
          {/* Change Password Form */}
          {!user?.googleAccountType && ( // Conditionally render password form if user is not using Google account
            <Box
              component="form"
              sx={{ maxWidth: "500px" }}
              onSubmit={passwordFormik.handleSubmit}
            >
              <Typography variant="h5">Change Password</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={12}>
                  {/* Content for the first half of the grid */}
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
                <Grid item xs={12} lg={12}>
                  {/* Content for the second half of the grid */}
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
              </Grid>
              <Grid item xs={12} lg={12}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  type="submit"
                >
                  Change Password
                </Button>
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>

      <ToastContainer />
    </Container>
  );
}

export default EditUser;
