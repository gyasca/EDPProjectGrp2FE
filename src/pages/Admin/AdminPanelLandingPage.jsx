import React from "react";
import { Container, Button, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import AdminPageTitle from "../../components/AdminPageTitle";
import administrator from "../../assets/administrator.jpg";

function AdminPanelLandingPage() {
  return (
    <Container>
      {/* Header Section */}
      <Box sx={{ textAlign: "center", marginBottom: "2rem", marginTop: "2rem" }}>
        <Typography variant="h2" gutterBottom>
          Welcome to Admin Panel
        </Typography>
        <Typography variant="h6">
          Manage users, settings, and more from here.
        </Typography>
      </Box>

      {/* Responsive image */}
      <Box sx={{ width: "100%", paddingY: "20px", textAlign: "center" }}>
        <img
          src={administrator}
          alt="Administrator"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </Box>

      {/* Button to navigate back to customer view */}
      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
        >
          Back to Customer View
        </Button>
      </Box>
    </Container>
  );
}

export default AdminPanelLandingPage;
