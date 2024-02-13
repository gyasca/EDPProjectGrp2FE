import React, { useState, useEffect, useContext } from "react";
import { useTheme } from "@mui/material/styles";
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
import { Link, useNavigate } from "react-router-dom";
import AdminPageTitle from "../../../components/AdminPageTitle";
import { grey } from "@mui/material/colors";
import UserContext from "../../../contexts/UserContext";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null); // Define userId state
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  // Inside your functional component
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };
  const handleDeleteUser = (userId) => {
    // Make a request to delete the user by ID
    http
      .delete(`/user/${userId}`)
      .then((response) => {
        // Update the users list after deletion
        setUsers(users.filter((user) => user.id !== userId));
        setUser(null);
        logout();
        navigate("/admin/users/allusers");
        handleClose(); // Close the dialog after successful deletion
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

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
      "&:visited": {
        color: grey, // Set the visited link color to be the same as the regular link color
      },
      renderCell: (params) => (
        <>
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label="View User"
            onClick={() => {
              navigate("/user/viewspecificuser/" + params.id);
            }}
          />
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit User"
            onClick={() => {
              navigate(
                "/admin/users/edit/" + params.id + "/editor/" + user?.id
              );
            }}
          />
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete User"
            onClick={() => handleOpen(params.id)}
          />
        </>
      ),
    },
    { field: "id", headerName: "ID", width: 50 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "roleName", headerName: "Role Name", width: 150 },
    { field: "membershipStatus", headerName: "Membership Status", width: 150 },
    { field: "mobileNumber", headerName: "Mobile Number", width: 150 },
    { field: "gender", headerName: "Gender", width: 120 },
    { field: "address", headerName: "Address", width: 200 },
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

  return (
    <Container
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AdminPageTitle title="All Users" subtitle={`Manage users`} backbutton />
      <Button
        component={Link}
        to="/admin/users/create"
        variant="contained"
        color="primary"
      >
        Create User
      </Button>
      <Box sx={{ maxWidth: "100%", overflowX: "auto", marginTop: 2 }}>
        <DataGrid rows={users} columns={columns} pageSize={5} />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user with ID: {userId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteUser(userId)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewUsers;
