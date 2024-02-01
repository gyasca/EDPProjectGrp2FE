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
                <Link to="/tutorials">
                  <Typography>Tutorials</Typography>
                </Link>

                {/* To be updated to only allow roleName admin to access */}
                <Link to="/viewusersadmin">
                  <Typography>View Users</Typography>
                </Link>

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
              <Route path={"/"} element={<Tutorials />} />
              <Route path={"/tutorials"} element={<Tutorials />} />
              <Route path={"/addtutorial"} element={<AddTutorial />} />
              <Route path={"/edittutorial/:id"} element={<EditTutorial />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/form"} element={<MyForm />} />
              <Route path={"/viewusersadmin"} element={<ViewUsers />} />
              <Route
                path={"/viewspecificuser/:userId"}
                element={<ViewSpecificUser />}
              />
              <Route
                path={"/edituser/:userId"}
                element={<EditUser />}
              />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
