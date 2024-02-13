import {
  AccountCircle,
  AssignmentInd,
  Edit,
  Key,
  Settings,
  ShoppingCart,
  Visibility,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import UserContext from "./contexts/UserContext";
import http from "./http";
import EventRouteAdmin from "./pages/Admin/Event/EventRouteAdmin";
import CartRoute from "./pages/Cart/CartRoute";
import CreateReviewPage from "./pages/CreateReviewPage";
import CreateTicket from "./pages/CreateTicket";
import DeleteReview from "./pages/DeleteReview";
import EditReviewPage from "./pages/EditReviewPage";
import EditUser from "./pages/EditUser";
import EventRoute from "./pages/Event/EventRoute";
import Login from "./pages/Login";
import MyForm from "./pages/MyForm";
import Register from "./pages/Register";
import ReviewsPage from "./pages/ReviewsPage";
import TicketPage from "./pages/TicketPage";
import TicketPageInd from "./pages/TicketPageInd";
import ViewSpecificUser from "./pages/ViewSpecificUser";
import MyTheme from "./themes/MyTheme";

// WHATEVER U DO DON'T LEAVE THIS OUT!!! DON'T DELETE THIS ROUTE
import AdminRoutes from "./pages/Admin/AdminRoutes";

import ViewUsers from "./pages/Admin/User/ViewUsers";
import ViewSpecificUser from "./pages/ViewSpecificUser";
import EditUser from "./pages/EditUser";
import EventRouteAdmin from './pages/Admin/Event/EventRouteAdmin';
import EventRoute from './pages/Event/EventRoute';

import ReviewsPage from './pages/Reviews/ReviewsPage';
import CreateReviewPage from './pages/Reviews/CreateReviewPage';
import EditReviewPage from './pages/Reviews/EditReviewPage';
import DeleteReview from './pages/Reviews/DeleteReview';

import TicketPage from './pages/Admin/Tickets/TicketPage';
import TicketPageInd from './pages/Admin/Tickets/TicketPageInd';
import CreateTicket from './pages/Tickets/CreateTicket';
import Chat from './pages/Tickets/Chat';
import ChatComponent from './pages/Tickets/ChatComponent'

import CreateForumPost from "./pages/CreateForumPost";
import ViewForum from "./pages/ViewForum";
import Home from "./pages/Home";

import Home from "./pages/Home";
import ForumRoutes from "./pages/Forum/ForumRoutes";
import ViewForum from "./pages/Forum/ViewForum";

// validateAdmin and validateUser functions from user.js to check if user is logged in

function App() {
  // const { user, setUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  // Global context to store if the current page is an admin page
  const [isAdminPage, setIsAdminPage] = useState(false);

  const [userLoading, setUserLoading] = useState(true);

  const [fullUser, setFullUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const [anchorEl, setAnchorEl] = useState(null);

  // logout logic
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const logout = () => {
    handleMenuClose(); // Close the menu
    localStorage.clear();
    window.location = "/";
  };
  // end of logout logic

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenStatus = localStorage.getItem("accessToken");
        if (tokenStatus) {
          const response = await http.get("/user/auth");
          setUser(response.data.user);
          console.log(user);
        } else {
          console.log("Token not ready");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch full user details (all attributes) when the component mounts
    if (user) {
      // Add null check here
      http
        .get(`/user/${user.id}`)
        .then((response) => {
          setFullUser(response.data);
          console.log("full user:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [user]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  // Render loading message while waiting for user data
  if (loading) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: setUser,
        userLoading: userLoading,
        isAdminPage: isAdminPage,
        setIsAdminPage: setIsAdminPage,
      }}
    >
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="sticky" className="AppBar">
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

                <Link to="/forum/view">
                  <Typography>Community Forum</Typography>
                </Link>

                <Link to="/reviews">
                  <Typography>Reviews</Typography>
                </Link>
                <Link to="/tickets/create">
                  <Typography>Customer Support</Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {/* {user && (
                  <>
                    <Link to="/cart" >
                      <IconButton>
                        <ShoppingCartIcon />
                      </IconButton>
                    </Link>
                    <Typography>{user.name}</Typography>
                    <Button>{user?.firstName}</Button>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )} */}

                {/* menu component start */}
                {user && (
                  <>
                    <Typography>
                      Welcome,{" "}
                      <Typography
                        style={{ fontWeight: "bold", display: "inline" }}
                      >
                        {fullUser && fullUser.firstName}
                      </Typography>
                    </Typography>

                    <Box>
                      <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                        color="inherit"
                      >
                        <AccountCircle />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          component={Link}
                          to={`/viewspecificuser/${user?.id}`}
                          onClick={handleMenuClose}
                        >
                          <Visibility />
                          &nbsp;&nbsp;&nbsp;View Profile
                        </MenuItem>

                        <MenuItem
                          component={Link}
                          to={`/edituser/${user?.id}`}
                          onClick={handleMenuClose}
                        >
                          <Edit />
                          &nbsp;&nbsp;&nbsp;Edit Profile
                        </MenuItem>
                        {fullUser && // Add a null check for fullUser
                          (fullUser.roleName === "employee-normal" ||
                            fullUser.roleName === "employee-master") && (
                            <MenuItem
                              component={Link}
                              to="/admin/home"
                              onClick={handleMenuClose}
                            >
                              <Settings />
                              &nbsp;&nbsp;&nbsp;Admin Panel
                            </MenuItem>
                          )}
                        <MenuItem
                          component={Link}
                          to="/"
                          onClick={handleMenuClose}
                        >
                          <AssignmentInd />
                          &nbsp;&nbsp;&nbsp;Orders
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/"
                          onClick={handleMenuClose}
                        >
                          <ShoppingCart />
                          &nbsp;&nbsp;&nbsp;Cart
                        </MenuItem>

                        <MenuItem component={Link} onClick={handleOpen}>
                          <Key />
                          &nbsp;&nbsp;&nbsp;
                          <Typography
                            style={{
                              fontWeight: "bold",
                              display: "inline",
                              color: "brown",
                            }}
                          >
                            LOGOUT
                          </Typography>
                        </MenuItem>
                      </Menu>
                    </Box>
                  </>
                )}
                {/* menu component end */}

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

              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Logout of UPlay Account</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to logout?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" color="inherit" onClick={logout}>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path={"/"} element={<Home />} />
              {/* <Route path={"/tutorials"} element={<Tutorials />} />
              <Route path={"/addtutorial"} element={<AddTutorial />} />
              <Route path={"/edittutorial/:id"} element={<EditTutorial />} /> */}

              {/* IMPORTANT DONT TOUCH */}
              <Route path={"/admin/*"} element={<AdminRoutes />} />
              {/* END OF IMPORTANT DONT TOUCH */}

              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/form"} element={<MyForm />} />
              {/* <Route path={"/viewusersadmin"} element={<ViewUsers />} /> */}
              <Route
                path={"/viewspecificuser/:userId"}
                element={<ViewSpecificUser />}
              />
              <Route path={"/edituser/:userId"} element={<EditUser />} />

              {/* Forum only logged in */}
              <Route path={"/forum/*"} element={<ForumRoutes />} />
              {/* Forum for Public */}
              <Route path={"/forum/view"} element={<ViewForum />} />
              {/* End of forums */}

              <Route path={"/admin/events/*"} element={<EventRouteAdmin />} />
              <Route path={"/events/*"} element={<EventRoute />} />
              <Route path={"/cart/*"} element={<CartRoute />} />

              <Route path={"/reviews"} element={<ReviewsPage />} />
              <Route path={"/reviews/create"} element={<CreateReviewPage />} />
              <Route path={"/reviews/edit/:id"} element={<EditReviewPage />} />
              <Route path={"/reviews/delete/:id"} element={<DeleteReview />} />

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
