import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function EditUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  const handleChangeDate = (dateTime) => {
    formik.setFieldValue("dateTime", dateTime); // Update the "dateTime" field directly with the selected dateTime
  };

  useEffect(() => {
    // Fetch user details when the component mounts
    console.log(userId);
    http
      .get(`/user/${userId}`)
      .then((response) => {
        setUser(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userId]);

  const formik = useFormik({
    initialValues: {
      roleName: user?.roleName || "", // Make sure to provide default values
      membershipStatus: user?.membershipStatus || "",
      mobileNumber: user?.mobileNumber || "",
      email: user?.email || "",
      password: user?.password || "",
      profilePhotoFile: user?.profilePhotoFile || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      gender: user?.gender || "",
      occupationType: user?.occupationType || "",
      address: user?.address || "",
      postalCode: parseInt(user?.postalCode) || "000000",
      newsletterSubscriptionStatus: user?.newsletterSubscriptionStatus || false,
      twoFactorAuthStatus: user?.twoFactorAuthStatus || false,
      verificationStatus: user?.verificationStatus || false,
      dateOfBirth: dayjs(user?.dateOfBirth) || dayjs(new Date()),
      confirmPassword: user?.password || "",
    },
    enableReinitialize: true, // This option allows the form to reinitialize when props (in this case, initialValues) change
    validationSchema: yup.object({
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
      //   roleName: yup.string().required("Role Name is required"), // Add this line
      //   membershipStatus: yup.string().required("Membership Status is required"), // Add this line
      //   mobileNumber: yup
      //     .number()
      //     .typeError("Mobile Number must be a number")
      //     .test(
      //       "len",
      //       "Mobile Number must be exactly 8 digits",
      //       (val) => val && val.toString().length === 8
      //     ), // Add this line
      //   profilePhotoFile: yup
      //     .mixed()
      //     .test(
      //       "fileSize",
      //       "File size is too large",
      //       (value) => value && value.size <= 1024 * 1024
      //     ), // Add this line
      //   lastName: yup.string().required("Last Name is required"), // Add this line
      //   gender: yup.string().required("Gender is required"), // Add this line
      //   occupationType: yup.string().required("Occupation Type is required"), // Add this line
      //   address: yup.string().required("Address is required"), // Add this line
      //   postalCode: yup
      //     .number()
      //     .typeError("Postal Code must be a number")
      //     .test(
      //       "len",
      //       "Postal Code must be at most 6 digits",
      //       (val) => val && val.toString().length <= 6
      //     ), // Add this line
      //   newsletterSubscriptionStatus: yup
      //     .boolean("must be boolean")
      //     .required("Newsletter Subscription Status is required"), // Add this line
      //   dateOfBirth: yup.date().required("Date of Birth is required"), // Add this line
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
      data.mobileNumber = data.mobileNumber.toString();
      data.email = data.email.trim().toLowerCase();
      data.password = data.password;
      data.profilePhotoFile = data.profilePhotoFile;
      data.firstName = data.firstName;
      data.lastName = data.lastName;
      data.gender = data.gender;
      data.occupationType = data.occupationType;
      data.address = data.address;
      data.postalCode = data.postalCode.toString();
      data.newsletterSubscriptionStatus = data.newsletterSubscriptionStatus;
      data.twoFactorAuthStatus = data.twoFactorAuthStatus;
      data.verificationStatus = data.verificationStatus;
      data.dateOfBirth = data.dateOfBirth;

      http
        .put(`/user/${userId}`, data)
        .then((res) => {
          console.log(res.data);
          navigate(`/viewspecificuser/${userId}`);
        })
        .catch(function (err) {
          toast.error(`${err.response.data.message}`);
        });
    },
  });

  if (!user) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit User Details
      </Typography>

      <Box
        component="form"
        sx={{ maxWidth: "500px" }}
        onSubmit={formik.handleSubmit}
      >
        {/* <input
          type="file"
          onChange={(event) =>
            formik.setFieldValue(
              "profilePhotoFile",
              event.currentTarget.files[0]
            )
          }
          onBlur={formik.handleBlur}
          error={
            formik.touched.profilePhotoFile &&
            Boolean(formik.errors.profilePhotoFile)
          }
          helperText={
            formik.touched.profilePhotoFile && formik.errors.profilePhotoFile
          }
        /> */}

        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="First Name"
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
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
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Change Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Confirm new Password"
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
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />

        <TextField
          fullWidth
          id="roleName"
          name="roleName"
          label="Role Name"
          select
          variant="outlined"
          value={formik.values.roleName}
          onChange={formik.handleChange}
          error={formik.touched.roleName && Boolean(formik.errors.roleName)}
          helperText={formik.touched.roleName && formik.errors.roleName}
          sx={{ marginY: "1rem" }}
        >
          <MenuItem value="employee-master">Employee (Master)</MenuItem>
          <MenuItem value="employee-normal">Employee (Normal)</MenuItem>
          <MenuItem value="customer">Customer</MenuItem>
        </TextField>

        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Mobile Number"
          name="mobileNumber"
          type="tel"
          value={formik.values.mobileNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)
          }
          helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
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
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />

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
          error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
          helperText={formik.touched.postalCode && formik.errors.postalCode}
        />

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

        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Date of Birth"
            // slotProps={{
            //   textField: {
            //     helperText: "MM/DD/YYYY",
            //   },
            // }}
            slotProps={{ textField: { fullWidth: true } }}
            value={formik.values.dateOfBirth}
            onChange={handleChangeDate}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" />
            )}
            error={
              formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)
            }
            helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
            sx={{ marginY: "1rem" }}
            dateOfBirth
          />
        </LocalizationProvider> */}

        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Save
        </Button>
      </Box>

      <ToastContainer />
    </Box>
  );
}

export default EditUser;
