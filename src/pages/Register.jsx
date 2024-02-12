import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import UserContext from "../contexts/UserContext";

function Register() {
  // start of google
  const [googleUser, setGoogleUser] = useState([]);
  function handleCallbackResponse(response) {
    // testing response from google
    console.log("Encoded JWT ID token: " + response.credential);
    // end of response testing from google. it was a success!! - greg

    // decode the jwt response from google to retrieve user name, email and picture
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    setGoogleUser(userObject);

    // handle login/register
    // Prepare user data to send to backend
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
      dateOfBirth: "2024-01-10T16:31:11.578Z",
    };

    http
      .get(`/user/email/${userObject.email}`)
      .then((res) => {
        console.log("user details from get by email: ", res.data);
        // If the user exists, log them in
        loginUser(userObject.email);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        // If the user does not exist, create a new user account and then log them in
        http
          .post("/user/register", userData)
          .then((res) => {
            console.log(res.data);
            loginUser(userObject.email);
          })
          .catch((err) => {
            toast.error(`${err.response.data.message}`);
          });
      });

    function loginUser(email) {
      // Log in the user by setting the access token and navigating to the home page
      const loginRequest = {
        email: email,
        password: "googlesecretpasswordxx94n2a",
      };
      http
        .post("/user/login", loginRequest)
        .then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
          setUser(res.data.user);
          console.log(res.data.user);
          navigate("/");
        })
        .catch((err) => {
          toast.error(`${err.response.data.message}`);
        });
    }
  }

  useEffect(() => {
    /* global google */
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
  }, []);

  // end of google
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      roleName: "customer",
      membershipStatus: "non-member",
      mobileNumber: "00000000",
      email: "",
      password: "",
      profilePhotoFile: "string",
      firstName: "",
      lastName: "string",
      gender: "string",
      occupationType: "string",
      address: "Example Avenue 1 Block 123",
      postalCode: "000000",
      newsletterSubscriptionStatus: false,
      twoFactorAuthStatus: false,
      verificationStatus: false,
      dateOfBirth: "2024-01-10T16:31:11.578Z",
      confirmPassword: "",
    },
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
      data.profilePhotoFile = data.profilePhotoFile;
      data.firstName = data.firstName;
      data.lastName = data.lastName;
      data.gender = data.gender;
      data.occupationType = data.occupationType;
      data.address = data.address;
      data.postalCode = data.postalCode;
      data.newsletterSubscriptionStatus = data.newsletterSubscriptionStatus;
      data.twoFactorAuthStatus = data.twoFactorAuthStatus;
      data.verificationStatus = data.verificationStatus;
      data.dateOfBirth = data.dateOfBirth;

      http
        .post("/user/register", data)
        .then((res) => {
          console.log(res.data);
          navigate("/login");
        })
        .catch(function (err) {
          toast.error(`${err.response.data.message}`);
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
        Register
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
          label="Password"
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
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Register
        </Button>

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
          <Box fullWidth id="signInBox"></Box>

          {googleUser && (
            <Box
              alignItems={"center"}
              fullWidth
              className="App"
              sx={{
                marginTop: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img src={googleUser.picture}></img>
              <h3>{googleUser.name}</h3>
            </Box>
          )}
        </Box>
      </Box>

      <ToastContainer />
    </Box>
  );
}

export default Register;
