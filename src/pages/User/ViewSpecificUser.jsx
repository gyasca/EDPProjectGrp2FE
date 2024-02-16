import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  Divider,
  CardActions,
  Stack,
  TextField
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminPageTitle from "../../components/AdminPageTitle";
import InfoBox from "../../components/InfoBox";
import http from "../../http";
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CardTitle from "../../components/CardTitle2";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CurrencyExchange from '@mui/icons-material/CurrencyExchange';
import { ToastContainer, toast } from "react-toastify";
import { ErrorMessage } from "formik";

const ViewUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [orders, setOrders] = useState([]);
  const [orderEventPictures, setOrderEventPictures] = useState({});
  const [orderEventName, setOrderEventName] = useState({});
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refundRequested, setRefundRequested] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    const eventPicturesDict = {};
    const eventNameDict = {}

    order.OrderItems.$values.forEach((item, index) => {
      http.get(`event/${item.EventId}`)
        .then(response => {
          const trimmedString = response.data.eventPicture.replace(/[\[\]"]+/g, '');
          const filenames = trimmedString.split(',');
          eventPicturesDict[item.EventId] = `${import.meta.env.VITE_FILE_BASE_URL}${filenames[0]}`;
          eventNameDict[item.EventId] = response.data.eventName
          setOrderEventPictures(eventPicturesDict);
          setOrderEventName(eventNameDict)
        })
        .catch(error => {
          console.error('Error fetching event details:', error);
        });
    });
  };

  const handleRefundRequest = async () => {
    try {
      const response = await http.post('/refund', {
        OrderId: selectedOrder.Id,
        RefundReason: refundReason,
        RefundAmount: selectedOrder.TotalAmount
      });
      toast.success('Refund successfully created');
      handleBackToSelectedOrders();
    } catch (error) {
      toast.error('Error in creating refund');
      console.error('Error sending refund request:', error.response.data.message, error.response.data.errors, error.response.data.stackTrace);
    }
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRecieved = () => {
    http.post(`/order/SetReceived/${selectedOrder.Id}`)
      .then(response => {
        setSelectedOrder(response.data);
        getOrders();
      })
      .catch(error => {
        console.error('Error updating order status:', error);
      });
  };

  const handleBackToSelectedOrders = () => {
    setRefundRequested(false);
    http.get(`/order/${selectedOrder.Id}`)
      .then(response => {
        setSelectedOrder(response.data);
      })
      .catch(error => {
        console.error('Error fetching order details:', error);
      });
  };
  

  const handleClickRefundRequest = () => {
    setRefundRequested(true);
  };


  function getOrders() {
    http.get(`/order`)
      .then((response) => {
        const nonPendingOrders = response.data.$values.filter(order => order.OrderStatus !== 'Pending');
        const sortedOrders = nonPendingOrders.sort((a, b) => b.Id - a.Id);
        setOrders(sortedOrders);
        console.log(sortedOrders);
      })
      .catch((error) => {
        console.error("Error fetching user orders:", error);
      });
  }


  useEffect(() => {
    http
      .get(`/user/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
    getOrders();
  }, [userId]);

  if (!user) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  const columns = [
    { field: 'Id', headerName: 'ID', width: 90, sortDirection: 'desc' },
    {
      field: 'OrderDate',
      headerName: 'Order Date',
      width: 120,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      }
    },
    { field: 'OrderStatus', headerName: 'Order Status', width: 120 },
    { field: 'OrderPaymentMethod', headerName: 'Payment Method', width: 140 },
    {
      field: 'TotalAmount',
      headerName: 'Total Amount',
      width: 120,
      valueFormatter: (params) => {
        const amount = parseFloat(params.value).toFixed(2);
        return `$${amount}`;
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 170,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View"
          onClick={() => handleViewDetails(params.row)}
        />,
      ],
    },
  ];

  return (
    <Box>
      <AdminPageTitle
        title="My Profile"
        subtitle={`View profile information`}
        backbutton
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="user details tabs"
              variant="fullWidth"
            >
              <Tab label="Profile" value="1" />
              <Tab label="Purchases" value="2" />
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
                        value={
                          user.verificationStatus ? "Verified" : "Not Verified"
                        }
                        boolean={user.verificationStatus}
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" gutterBottom>
                      <InfoBox
                        title="Authenticated with Google"
                        value={
                          user.googleAccountType
                            ? "Google Verified"
                            : "Not Google Verified"
                        }
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
            <Box>
              <Paper elevation={3} sx={{ mt: 2 }}>
                {refundRequested ? (
                  <>
                    <CardContent>
                      <CardTitle title="Refund" back={true} onBackClick={handleBackToSelectedOrders} icon={<CurrencyExchange />} />
                      <Box marginTop={2}>
                        <Typography variant="h6" color="textSecondary" mt={"1rem"}>
                          Order Details:
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }}>
                          <InfoBox title="Name" value={user.firstName} />
                          <InfoBox title="Email" value={user.email} />
                          <InfoBox title="Order ID" value={selectedOrder.Id} />
                        </Stack>

                        <Divider style={{ marginBottom: '1rem', marginTop: '1rem' }} />

                        <Typography variant="h6" color="textSecondary">
                          Refund Reason:
                        </Typography>

                        <TextField
                          margin="normal"
                          fullWidth
                          id="refundReason"
                          label="Describe your reason"
                          name="refundReason"
                          multiline
                          rows={4}
                          value={refundReason}
                          onChange={e => setRefundReason(e.target.value)}
                          variant="outlined"
                        />

                        <Box mt={3}>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleRefundRequest}
                          >
                            Request Refund
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </>
                ) : selectedOrder ? (
                  <CardContent>
                    <CardTitle title="Order Details" back={true} onBackClick={handleBackToOrders} icon={<ReceiptLongIcon />} />
                    <Box marginTop={2}>
                      <Typography variant="body1" gutterBottom>
                        Payment Status: {selectedOrder.OrderPaymentStatus !== 'NIL' ? "Paid" : "Not Paid"}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Order Status: {selectedOrder.OrderStatus}
                      </Typography>

                      {selectedOrder.OrderStatus === "Order Delivered" && (
                        <Box mt={2}>
                          <Button variant="outlined" color="primary" fullWidth onClick={handleRecieved}>
                            Order Received
                          </Button>
                          <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 1 }} onClick={handleClickRefundRequest}>
                            Request Refund
                          </Button>
                        </Box>
                      )}
                      <Typography variant="subtitle1" gutterBottom>
                        Order Items:
                      </Typography>
                      {selectedOrder && Array.isArray(selectedOrder.OrderItems.$values) && (
                        selectedOrder.OrderItems.$values.map((item, index) => (
                          <Box key={index} marginBottom={2}>
                            <Card variant='outlined'>
                              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px' }}>
                                <CardMedia
                                  component="img"
                                  sx={{ width: 60, height: 60, flexShrink: 0, borderRadius: '4px' }}
                                  image={orderEventPictures[item.EventId]}
                                  alt={item.EventId}
                                />
                                <Box sx={{ marginLeft: '16px', flexGrow: 1 }}>
                                  <Typography variant="body1" fontWeight={500}>
                                    {orderEventName[item.EventId]}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    Quantity: {item.Quantity}
                                  </Typography>
                                </Box>
                                <Typography variant="body1" color="primary">
                                  ${item.TotalPrice.toFixed(2)}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Box>
                        ))
                      )}
                      <Divider sx={{ my: 1 }} />
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Payment Summary
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText primary="Subtotal" primaryTypographyProps={{ variant: 'body1' }} />
                            <Typography variant="body1">${selectedOrder.SubTotalAmount.toFixed(2)}</Typography>
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="GST (9%)" primaryTypographyProps={{ variant: 'body1' }} />
                            <Typography variant="body1">${selectedOrder.GstAmount.toFixed(2)}</Typography>
                          </ListItem>
                          <Divider />
                          <ListItem>
                            <ListItemText primary="Total" primaryTypographyProps={{ variant: 'body1' }} />
                            <Typography variant="body1" color="primary">${selectedOrder.TotalAmount.toFixed(2)}</Typography>
                          </ListItem>
                        </List>
                      </Box>
                    </Box>
                  </CardContent>
                ) : (
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                      rows={orders}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      getRowId={(row) => row.Id}
                    />
                  </div>
                )}
              </Paper>
            </Box>
          )}

        </Grid>

        {/* User profile pic and email */}
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
                src={`${import.meta.env.VITE_FILE_BASE_URL}${user.profilePhotoFile
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
      </Grid>
    </Box>
  );
};

export default ViewUser;
