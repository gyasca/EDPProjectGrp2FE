import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../contexts/UserContext";
import { jwtDecode } from "jwt-decode";
import { validateUser } from "../functions/user";
import { useSnackbar } from "notistack";

function Login() {
  const [googleUser, setGoogleUser] = useState(null);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [checkedLoggedIn, setCheckedLoggedIn] = useState(null);

  const handleCallbackResponse = (response) => {
    const userObject = jwtDecode(response.credential);
    setGoogleUser(userObject);

    const userData = {
      roleName: "customer",
      membershipStatus: "non-member",
      mobileNumber: "00000000",
      email: userObject.email,
      password: "googlesecretpasswordxx94n2a",
      profilePhotoFile: userObject.picture,
      firstName: userObject.name,
      lastName: "Last Name",
      gender: "string",
      occupationType: "string",
      address: "Example Avenue 1 Block 123",
      postalCode: "000000",
      newsletterSubscriptionStatus: false,
      twoFactorAuthStatus: false,
      verificationStatus: userObject.email_verified,
      googleAccountType: true,
      dateOfBirth: "2024-01-10T16:31:11.578Z",
    };

    http
      .get(`/user/email/${userObject.email}`)
      .then((res) => {
        loginUser(userObject.email);
      })
      .catch((error) => {
        http
          .post("/user/register", userData)
          .then((res) => {
            loginUser(userObject.email);
          })
          .catch((err) => {
            toast.error(`${err.response.data.message}`);
          });
      });

    const loginUser = (email) => {
      const loginRequest = {
        email: email,
        password: "googlesecretpasswordxx94n2a",
      };
      http
        .post("/user/login", loginRequest)
        .then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
          setUser(res.data.user);
          navigate("/");
        })
        .catch((err) => {
          toast.error(`${err.response.data.message}`);
        });
    };
  };

  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        "661561841765-j6easap6fmjismk71ohvhl3pp9shtth1.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInBox"), {
      theme: "outline",
      size: "large",
    });

    google.accounts.id.prompt();
  }, [checkedLoggedIn]);

  useEffect(() => {
    if (validateUser()) {
      enqueueSnackbar("You are already logged in!", {
        variant: "error",
      });
      setCheckedLoggedIn(true);
      return navigate("/");
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
      password: yup.string().trim().required("Password is required"),
    }),
    onSubmit: (data) => {
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      http
        .post("/user/login", data)
        .then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
          setUser(res.data.user);
          navigate("/");
        })
        .catch((err) => {
          toast.error(`Incorrect email or password`);
        });
    },
  });

  // forgot password functionalities
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Validation schema for the Forgot Password form
  const forgotPasswordSchema = yup.object({
    email: yup
      .string()
      .trim()
      .email("Enter a valid email")
      .max(50, "Email must be at most 50 characters")
      .required("Email is required"),
  });

  // Formik hook for the Forgot Password form
  // const forgotPasswordFormik = useFormik({
  //   initialValues: {
  //     email: "",
  //   },
  //   validationSchema: forgotPasswordSchema,
  //   onSubmit: (values) => {
  //     // Send the email to the backend for password reset
  //     console.log(values);

  //     // Check if the user exists
  //     http
  //       .post(`/user/email/${values.email}`)
  //       .then((res) => {
  //         const userData = res.data;
  //         // Check if the user has a Google account type
  //         if (userData.googleAccountType) {
  //           toast.error(
  //             "Accounts with Google account type cannot change password."
  //           );
  //           return;
  //         }
  //       })
  //       .catch((error) => {
  //         toast.error("User does not exist.");
  //         console.log("user doesn't exist",error);
  //       });

  //     values.email = values.email.trim();
  //     http
  //       .post(`/user/forgotpassword/${values.email}`)
  //       .then((res) => {
  //         toast.success("Password reset link sent to your email.");
  //       })
  //       .catch((error) => {
  //         toast.error("Failed to send password reset link.");
  //         console.log(error);
  //       });
  //   },
  // });

  // Formik hook for the Forgot Password form
  const forgotPasswordFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: (values) => {
      // Disable the button to prevent multiple submissions
  
      // Check if the user exists
      http
        .get(`/user/email/${values.email}`)
        .then((res) => {
          const userData = res.data;
          // Check if the user has a Google account type
          console.log(res.data);
          if (userData.googleAccountType) {
            toast.error(
              "Accounts with Google account type cannot change password."
            );
          } else {
            // Proceed with sending the password reset link
            values.email = values.email.trim();
            http
              .post(`/user/forgotpassword/${values.email}`)
              .then((res) => {
                toast.success("Password reset link sent to your email.");
              })
              .catch((error) => {
                toast.error("Failed to send password reset link.");
        
                console.log(error);
              });
          }
        })
        .catch((error) => {
          // Handle the case where the user does not exist
          toast.error("User does not exist.");
          console.log("User doesn't exist", error);
        });
    },
  });

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
        Sign in to UPlay Account
      </Typography>
      <Box
        component="form"
        sx={{ maxWidth: "500px" }}
        onSubmit={formik.handleSubmit}
      >
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
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Login
        </Button>
      </Box>

      <Box
        fullWidth
        className="App"
        sx={{
          marginTop: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box id="signInBox"></Box>
        {googleUser && (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <img
                src={googleUser.picture}
                alt="Profile"
                style={{ borderRadius: "50%", width: "50px", height: "50px" }}
              />
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">{googleUser.name}</Typography>
            </Grid>
          </Grid>
        )}

        {/* Forgot Password Form */}
        {showForgotPassword ? (
          <Box
            component="form"
            sx={{ maxWidth: "500px", mt: 2 }}
            onSubmit={forgotPasswordFormik.handleSubmit}
          >
            {/* Form title */}
            <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
              Forgot Your Password?
            </Typography>
            {/* Email field */}
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Email"
              name="email"
              value={forgotPasswordFormik.values.email}
              onChange={forgotPasswordFormik.handleChange}
              onBlur={forgotPasswordFormik.handleBlur}
              error={
                forgotPasswordFormik.touched.email &&
                Boolean(forgotPasswordFormik.errors.email)
              }
              helperText={
                forgotPasswordFormik.touched.email &&
                forgotPasswordFormik.errors.email
              }
            />
            {/* Submit button */}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              type="submit"
            >
              Send Reset Link
            </Button>
          </Box>
        ) : (
          // Button to show forgot password form
          <Button
            variant="text"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot Password?
          </Button>
        )}
        {/* Divider */}
        <Divider sx={{ width: "100%", mt: 2, mb: 2 }} />

        {/* Don't have an account? Register now */}
        <Typography variant="body2" sx={{ mt: 4 }}>
          Don't have an account?{" "}
          <Button href="/register" variant="body2" sx={{ color: "orangered" }}>
            Register an account
          </Button>
        </Typography>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default Login;
