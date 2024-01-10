// ViewUsers.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
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

  // Function to handle user deletion
  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // Make a request to delete the user by ID
      http
        .delete(`/user/${userId}`)
        .then((response) => {
          // Update the users list after deletion
          setUsers(users.filter((user) => user.id !== userId));
          toast.success("User deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          toast.error("Error deleting user");
        });
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Admin Page - All Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Actions</TableCell>{" "}
              {/* New column for edit and delete buttons */}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>
                  <IconButton
                    component={Link}
                    to={`/viewspecificuser/${user.id}`}
                    title="View User"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    component={Link}
                    to={`/viewuser/${user.id}`}
                    title="View User"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteUser(user.id)}
                    title="Delete User"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ViewUsers;
