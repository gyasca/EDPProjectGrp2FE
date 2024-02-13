import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminPageTitle from "../../components/AdminPageTitle";
import InfoBox from "../../components/InfoBox";
import http from "../../http";

const ViewUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };


  useEffect(() => {
    http
      .get(`/user/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userId]);

  if (!user) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <Box>
      <AdminPageTitle title="User Details" subtitle={`View profile information`} backbutton />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
            {user.googleAccountType ? (
              <Avatar
                alt="profilephoto"
                src={user.profilePhotoFile}
                sx={{ width: 200, height: 200, margin: "0 auto 16px auto" }}
              />
            ) : (
              <Avatar
                alt="profilephoto"
                src={`${import.meta.env.VITE_FILE_BASE_URL}${
                  user.profilePhotoFile
                }`}
                sx={{ width: 200, height: 200, margin: "0 auto 16px auto" }}
              />
            )}
            <Typography variant="h6" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {user.email}
            </Typography>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="contained"
                component={Link}
                to={`/user/edituser/${userId}`}
                sx={{ width: "100%" }}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="user details tabs"
              variant="fullWidth" // Spread tabs equally
            >
              <Tab label="Profile" value="1" />
              <Tab label="Purchases" value="2" />
              <Tab label="Cart" value="3" />
              <Tab label="Wishlist" value="4" />
            </Tabs>
          </Paper>
          {activeTab === "1" && (
            <Box>
              <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Account status
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <InfoBox
                        title="Verification Status:"
                        value={user.verificationStatus ? "Verified" : "Not Verified"}
                        boolean={user.verificationStatus}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <InfoBox
                        title="Authenticated with Google"
                        value={user.googleAccountType ? "Google Verified" : "Not Google Verified"}
                        boolean={user.googleAccountType}
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <InfoBox
                        title="Mobile Number:"
                        value={user.mobileNumber
                          .replace(/(\d{4})/g, "$1 ")
                          .trim()}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <InfoBox
                        title="Gender:"
                        value={
                          user.gender.charAt(0).toUpperCase() +
                          user.gender.slice(1)
                        }
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <InfoBox
                        title="Occupation Type:"
                        value={
                          user.occupationType.charAt(0).toUpperCase() +
                          user.occupationType.slice(1)
                        }
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <InfoBox
                        title="Address:"
                        value={
                          user.address.charAt(0).toUpperCase() +
                          user.address.slice(1)
                        }
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <InfoBox
                        title="Postal Code:"
                        value={
                          user.postalCode.charAt(0).toUpperCase() +
                          user.postalCode.slice(1)
                        }
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <InfoBox
                        title="Newsletter Subscription Status:"
                        value={
                          user.newsletterSubscriptionStatus
                            ? "Subscribed"
                            : "Not Subscribed"
                        }
                        boolean={user.newsletterSubscriptionStatus}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <InfoBox
                        title="Date of Birth:"
                        value={new Date(user.dateOfBirth).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
          {activeTab === "2" && (
            <Typography variant="h6">Display Purchases Here</Typography>
          )}
          {activeTab === "3" && (
            <Typography variant="h6">Display Cart Here</Typography>
          )}
          {activeTab === "4" && (
            <Typography variant="h6">Display Wishlist Here</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewUser;
