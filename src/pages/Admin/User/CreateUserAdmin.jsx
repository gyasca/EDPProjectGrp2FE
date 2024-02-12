import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  MenuItem,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPageTitle from "../../../components/AdminPageTitle";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import DatePicker from "react-datepicker";
import { parse, parseISO } from "date-fns";

function Register() {
  const navigate = useNavigate();

  const handleChangeDate = (dateTime) => {
    formik.setFieldValue("dateTime", dateTime); // Update the "dateTime" field directly with the selected dateTime
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

  const formik = useFormik({
    initialValues: {
      roleName: "customer",
      membershipStatus: "non-member",
      mobileNumber: "",
      email: "",
      password: "",
      profilePhotoFile: "",
      firstName: "",
      lastName: "",
      gender: "",
      occupationType: "",
      address: "",
      postalCode: "",
      newsletterSubscriptionStatus: false,
      twoFactorAuthStatus: false,
      verificationStatus: false,
      //   field for edit
      //   dateOfBirth: dayjs(user.dateOfBirth),
      dateOfBirth: dayjs(),
      confirmPassword: "",
    },
    validationSchema: yup.object({
      mobileNumber: yup
        .string()
        .matches(/^\d{8}$/, "Mobile Number must be exactly 8 digits"),
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
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
          "At least 1 letter and 1 number"
        ),
      confirmPassword: yup
        .string()
        .trim()
        .required("Confirm password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
      postalCode: yup
        .string()
        .matches(/^\d{6}$/, "Postal Code must be exactly 6 digits"),
    }),
    onSubmit: (data) => {
      // Ensure values is defined
      if (!data) {
        console.error("Form values are undefined.");
        return;
      }
      console.log("Data:", data);
      data.roleName = data.roleName;
      data.membershipStatus = data.membershipStatus;
      data.mobileNumber = data.mobileNumber;
      data.email = data.email.trim().toLowerCase();
      data.password = data.password;
      // Convert dayjs object to ISO 8601 format
      data.dateOfBirth = formik.values.dateOfBirth.format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      data.profilePhotoFile = imageFile;
      data.firstName = data.firstName;
      data.lastName = data.lastName;
      data.gender = data.gender;
      data.occupationType = data.occupationType;
      data.address = data.address;
      data.postalCode = String(data.postalCode);
      data.newsletterSubscriptionStatus = data.newsletterSubscriptionStatus;
      data.twoFactorAuthStatus = data.twoFactorAuthStatus;
      data.verificationStatus = data.verificationStatus;
      //   if (imageFile) {
      //     data.imageFile = imageFile;

      http
        .post("/user/register", data)
        .then((res) => {
          console.log(res.data);
          navigate("/admin/users/allusers");
        })
        .catch(function (err) {
          toast.error(`${err.response.data.message}`);
        });
    },
  });

  return (
    <Container>
      <AdminPageTitle title="Create User" subtitle={`Admin`} backbutton />
      <Box
        sx={{
          marginTop: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} sx={{ marginY: "1rem" }}>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="First Name"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Last Name"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
              />
            </Grid>
            {/* Datepicker field for dateTime */}
            <Grid item xs={12} lg={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date of Birth"
                  slotProps={{ textField: { fullWidth: true } }}
                  disableFuture
                  value={formik.values.dateOfBirth}
                  onChange={handleChangeDate}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" />
                  )}
                  error={
                    formik.touched.dateOfBirth &&
                    Boolean(formik.errors.dateOfBirth)
                  }
                  helperText={
                    formik.touched.dateOfBirth && formik.errors.dateOfBirth
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
                  value={formik.values.membershipStatus}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.membershipStatus &&
                    Boolean(formik.errors.membershipStatus)
                  }
                  helperText={
                    formik.touched.membershipStatus &&
                    formik.errors.membershipStatus
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
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.mobileNumber &&
                  Boolean(formik.errors.mobileNumber)
                }
                helperText={
                  formik.touched.mobileNumber && formik.errors.mobileNumber
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
                value={formik.values.gender}
                onChange={formik.handleChange}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={formik.touched.gender && formik.errors.gender}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="prefer-not-to-say">Prefer Not to Say</MenuItem>
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
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Postal Code"
                name="postalCode"
                type="number"
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.postalCode && Boolean(formik.errors.postalCode)
                }
                helperText={
                  formik.touched.postalCode && formik.errors.postalCode
                }
              />
            </Grid>

            <Grid item xs={12} lg={6}>
            <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Role Name"
                name="roleName"
                select
                variant="outlined"
                value={formik.values.roleName}
                onChange={formik.handleChange}
                error={
                  formik.touched.roleName &&
                  Boolean(formik.errors.roleName)
                }
                helperText={
                  formik.touched.roleName && formik.errors.roleName
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
                value={formik.values.occupationType}
                onChange={formik.handleChange}
                error={
                  formik.touched.occupationType &&
                  Boolean(formik.errors.occupationType)
                }
                helperText={
                  formik.touched.occupationType && formik.errors.occupationType
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
                value={formik.values.newsletterSubscriptionStatus}
                onChange={formik.handleChange}
                error={
                  formik.touched.newsletterSubscriptionStatus &&
                  Boolean(formik.errors.newsletterSubscriptionStatus)
                }
                helperText={
                  formik.touched.newsletterSubscriptionStatus &&
                  formik.errors.newsletterSubscriptionStatus
                }
              >
                <MenuItem value={true}>Subscribed</MenuItem>
                <MenuItem value={false}>Not subscribed</MenuItem>
              </TextField>
            </Grid>
          </Grid>
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
            {imageFile && (
              <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                <img
                  alt="profilephoto"
                  src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                ></img>
              </Box>
            )}
          </Box>
          <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
