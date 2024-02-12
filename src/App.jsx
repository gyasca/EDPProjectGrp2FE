import "./App.css";
import { useState, useEffect } from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import MyTheme from "./themes/MyTheme";
import Tutorials from "./pages/Tutorials";
import AddTutorial from "./pages/AddTutorial";
import EditTutorial from "./pages/EditTutorial";
import MyForm from "./pages/MyForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import http from "./http";
import UserContext from "./contexts/UserContext";
import ViewUsers from "./pages/ViewUsers";
import ViewSpecificUser from "./pages/ViewSpecificUser";
import EditUser from "./pages/EditUser";
import EventRouteAdmin from './pages/Admin/Event/EventRouteAdmin';
import EventRoute from './pages/Event/EventRoute';

import ReviewsPage from './pages/Reviews/ReviewsPage';
import CreateReviewPage from './pages/Reviews/CreateReviewPage';
import EditReviewPage from './pages/Reviews/EditReviewPage';
import DeleteReview from './pages/Reviews/DeleteReview';

import TicketPage from './pages/Tickets/TicketPage';
import TicketPageInd from './pages/Tickets/TicketPageInd';
import CreateTicket from './pages/Tickets/CreateTicket';
import Chat from './pages/Tickets/Chat';

import CreateForumPost from "./pages/CreateForumPost";
import ViewForum from "./pages/ViewForum";
import Home from "./pages/Home";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (localStorage.getItem("accessToken")) {
          const response = await http.get("/user/auth");
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  // Render loading message while waiting for user data
  if (loading) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    UPlay
                  </Typography>
                </Link>
                <Link to="/events">
                  <Typography>Event</Typography>
                </Link>

                {/* To be updated to only allow roleName admin to access */}
                <Link to="/viewusersadmin" ><Typography>View Users</Typography></Link>

                <Link to="/forum/view" ><Typography>Community Forum</Typography></Link>

                <Link to="/reviews" ><Typography>Reviews</Typography></Link>
                <Link to="/staff/tickets" ><Typography>Customer Service Tickets</Typography></Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                    <Typography>{user.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )}
                {!user && (
                  <>
                    <Link to="/register">
                      <Typography>Register</Typography>
                    </Link>
                    <Link to="/login">
                      <Typography>Login</Typography>
                    </Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path={"/"} element={<Home />} />
              <Route path={"/tutorials"} element={<Tutorials />} />
              <Route path={"/addtutorial"} element={<AddTutorial />} />
              <Route path={"/edittutorial/:id"} element={<EditTutorial />} />
              
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/form"} element={<MyForm />} />
              <Route path={"/viewusersadmin"} element={<ViewUsers />} />
              <Route path={"/viewspecificuser/:userId"} element={<ViewSpecificUser />} />
              <Route path={"/edituser/:userId"} element={<EditUser />} />

              <Route path={"/forum/create"} element={<CreateForumPost />} />
              <Route path={"/forum/view"} element={<ViewForum />} />

              <Route path={"/admin/events/*"} element={<EventRouteAdmin />} />
              <Route path={"/events/*"} element={<EventRoute />} />

              <Route path={"/reviews"} element={<ReviewsPage />} />
              <Route path={"/reviews/create"} element={<CreateReviewPage />} />
              <Route path={"/reviews/edit/:id"} element={<EditReviewPage />} />
              <Route path={"/reviews/delete/:id"} element={<DeleteReview />} />

              <Route path={"/staff/tickets"} element={<TicketPage />} />
              <Route path={"/staff/tickets/:id"} element={<TicketPageInd />} />


              <Route path={"/tickets/create"} element={<CreateTicket />} />
              <Route path={"/tickets/chat"} element={<Chat />} />
              <Route path={"/tickets/chat/:id"} element={<Chat />} />

            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
