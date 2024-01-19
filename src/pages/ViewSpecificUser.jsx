// ViewUser.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Paper } from "@mui/material";
import http from "../http";

const ViewUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

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

  if (!user) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        User Details
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6">Role Name: {user.roleName}</Typography>
        <Typography variant="h6">
          Membership Status: {user.membershipStatus}
        </Typography>
        <Typography variant="h6">Mobile Number: {user.mobileNumber}</Typography>
        <Typography variant="h6">Email: {user.email}</Typography>
        <Typography variant="h6">
          Profile Photo File: {user.profilePhotoFile}
        </Typography>
        <Typography variant="h6">First Name: {user.firstName}</Typography>
        <Typography variant="h6">Last Name: {user.lastName}</Typography>
        <Typography variant="h6">Gender: {user.gender}</Typography>
        <Typography variant="h6">
          Occupation Type: {user.occupationType}
        </Typography>
        <Typography variant="h6">Address: {user.address}</Typography>
        <Typography variant="h6">Postal Code: {user.postalCode}</Typography>
        <Typography variant="h6">
          Newsletter Subscription Status:{" "}
          {user.newsletterSubscriptionStatus.toString()}
        </Typography>
        <Typography variant="h6">
          Two Factor Auth Status: {user.twoFactorAuthStatus.toString()}
        </Typography>
        <Typography variant="h6">
          Verification Status: {user.verificationStatus.toString()}
        </Typography>
        <Typography variant="h6">
          Date of Birth: {new Date(user.dateOfBirth).toLocaleString()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ViewUser;
