import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  let { token } = useParams();
  // Decode the token if needed
  token = decodeURIComponent(token);
  const [resetSuccessful, setResetSuccessful] = useState(false);

  const validationSchema = yup.object({
    newPassword: yup
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
      .oneOf([yup.ref("newPassword")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      token: token,
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
        console.log(values);
      http
        .post("/user/resetpassword", { token, newPassword: values.newPassword })
        .then(() => {
          setResetSuccessful(true);
        })
        .catch((error) => {
          toast.error("Failed to reset password.");
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
        Reset Your Password
      </Typography>
      {resetSuccessful ? (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body1">
            Your password has been successfully reset.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/login"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      ) : (
        <Box
          component="form"
          sx={{ maxWidth: "500px" }}
          onSubmit={formik.handleSubmit}
        >
          <TextField
            fullWidth
            margin="dense"
            autoComplete="off"
            label="New Password"
            name="newPassword"
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            helperText={formik.touched.newPassword && formik.errors.newPassword}
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
            Reset Password
          </Button>
        </Box>
      )}
      <ToastContainer />
    </Box>
  );
}

export default ResetPassword;
