import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Button } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import http from "../http";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);

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
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <GridActionsCellItem
            icon={<Link to={`/viewspecificuser/${params.id}`}><VisibilityIcon /></Link>}
            label="View User"
          />
          <GridActionsCellItem
            icon={<Link to={`/edituser/${params.id}`}><EditIcon /></Link>}
            label="Edit User"
          />
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete User"
            onClick={() => handleDeleteUser(params.id)}
          />
        </>
      ),
    },
  ];

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // Make a request to delete the user by ID
      axios
        .delete(`/user/${userId}`)
        .then((response) => {
          // Update the users list after deletion
          setUsers(users.filter((user) => user.id !== userId));
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Page - All Users
      </Typography>
      <Button component={Link} to="/createuser" variant="contained" color="primary">
        Create User
      </Button>
      <div style={{ height: 400, width: '100%', marginTop: '1rem' }}>
        <DataGrid rows={users} columns={columns} pageSize={5} />
      </div>
    </Container>
  );
};

export default ViewUsers;
