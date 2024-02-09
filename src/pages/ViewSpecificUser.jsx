// ViewUser.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Paper, IconButton, Button } from "@mui/material";
import http from "../http";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link, useNavigate } from 'react-router-dom';

const ViewUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const handleBack = () => {
    // Use navigate to go back to the previous page
    navigate(-1);
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

  if (!user) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <Box mt={4}>
      <Button
        variant="outlined"
        color="primary"
        sx={{ marginBottom: 2 }}
        onClick={handleBack}
      >
        Back
      </Button>
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
      <IconButton component={Link} to={`/edituser/${userId}`} title="Edit user">
        <EditIcon />
      </IconButton>
      <Button component={Link} to={`/viewusersadmin`} title="Edit user">
        View All users
      </Button>
    </Box>
  );
};

export default ViewUser;
