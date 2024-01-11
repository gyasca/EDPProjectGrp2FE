import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import http from './http';
import UserContext from './contexts/UserContext';

import ReviewsPage from './pages/ReviewsPage';
import CreateReviewPage from './pages/CreateReviewPage';
import EditReviewPage from './pages/EditReviewPage';
import DeleteReview from './pages/DeleteReview';

import TicketPage from './pages/TicketPage';
import CreateTicket from './pages/CreateTicket';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

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
                <Link to="/tutorials" ><Typography>Tutorials</Typography></Link>
                <Link to="/reviews" ><Typography>Reviews</Typography></Link>
                <Link to="/tickets" ><Typography>Customer Service Tickets</Typography></Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                    <Typography>{user.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )
                }
                {!user && (
                  <>
                    <Link to="/register" ><Typography>Register</Typography></Link>
                    <Link to="/login" ><Typography>Login</Typography></Link>
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

              <Route path={"/reviews"} element={<ReviewsPage />} />
              <Route path={"/reviews/create"} element={<CreateReviewPage />} />
              <Route path={"/reviews/edit/:id"} element={<EditReviewPage />} />
              <Route path={"/reviews/delete/:id"} element={<DeleteReview />} />

              <Route path={"/tickets"} element={<TicketPage />} />
              <Route path={"/tickets/create"} element={<CreateTicket />} />

            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
