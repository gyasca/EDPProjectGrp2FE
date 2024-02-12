import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import http from "../../../http";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import AdminPageTitle from "../../../components/AdminPageTitle";
import { grey } from "@mui/material/colors";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null); // Define userId state

  // Inside your functional component
const theme = useTheme();

  const [open, setOpen] = useState(false);
  const handleOpen = (userId) => {
    setUserId(userId); // Set userId when opening the dialog
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // Fetch all users when the component mounts
    http
      .get("/user/getallnosearch")
      .then((response) => {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error(`${("Error fetching users:", error)}`);
      });
  }, []);

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      '&:visited': {
        color: grey, // Set the visited link color to be the same as the regular link color
      },
      renderCell: (params) => (
        <>
          <GridActionsCellItem
            icon={
              <Link to={`/viewspecificuser/${params.id}`}>
                <VisibilityIcon />
              </Link>
            }
            label="View User"
          />
          <GridActionsCellItem
            icon={
              <Link to={`/admin/users/edit/${params.id}`}>
                <EditIcon />
              </Link>
            }
            label="Edit User"
          />
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete User"
            onClick={() => handleOpen(params.id)}
          />
        </>
      ),
    },
    { field: "id", headerName: "ID", width: 70 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "roleName", headerName: "Role Name", width: 150 },
    { field: "membershipStatus", headerName: "Membership Status", width: 150 },
    { field: "mobileNumber", headerName: "Mobile Number", width: 150 },
    { field: "gender", headerName: "Gender", width: 120 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "postalCode", headerName: "Postal Code", width: 120 },
    {
      field: "newsletterSubscriptionStatus",
      headerName: "Newsletter Subscription",
      width: 200,
    },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      width: 150,
    },
  ];

  const handleDeleteUser = (userId) => {
    // Make a request to delete the user by ID
    http
      .delete(`/user/${userId}`)
      .then((response) => {
        // Update the users list after deletion
        setUsers(users.filter((user) => user.id !== userId));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  return (
    <Container>
      <AdminPageTitle title="All Users" subtitle={`Manage users`} backbutton />
      <Button
        component={Link}
        to="/admin/users/create"
        variant="contained"
        color="primary"
      >
        Create User
      </Button>
      <Box sx={{ height: 400, width: "100%", marginTop: 2 }}>
        <DataGrid rows={users} columns={columns} pageSize={5} />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Tutorial</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user with ID: {userId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteUser}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewUsers;