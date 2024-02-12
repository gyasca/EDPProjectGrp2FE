import { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Box, Divider, List } from "@mui/material";
import { useSnackbar } from "notistack";
import UserContext from '../../contexts/UserContext';
import AdminNavList from "../../components/AdminNavList";
import { validateAdmin } from "../../functions/user";

// other general dependencies/components
import NotFound from "../errors/NotFound";

// import admin pages:
// user
import ViewUsers from "./User/ViewUsers";
import EditUserAdmin from "./User/EditUserAdmin";
import AdminPanelLandingPage from "./AdminPanelLandingPage";
import CreateUserAdmin from "./User/CreateUserAdmin";

// event

// ticket

// whatever ur admin page feature name is

function AdminRoutes() {
  // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
  // Do note that admin has 2 roles. employee-normal and employee-master.
  const { setIsAdminPage } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdminPage(true);
    if (!validateAdmin()) {
        console.log("not admin");
      enqueueSnackbar("You must be an admin to view this page", {
        variant: "error",
      });
      navigate("/");
    }
  }, [validateAdmin]);

  return (
      <Box sx={{ display: "flex", flexGrow: 1, flexWrap: 1 }}>
        <Box sx={{ display: ["none", "none", "flex"] }}>
          <List
            sx={{
              width: "250px",
              height: "fit-content",
              position: "sticky",
              top: 64,
            }}
          >
            <AdminNavList />
          </List>
          <Divider orientation="vertical" flexItem />
        </Box>
        <Routes>
          {/* General shared paths */}
          <Route path="*" element={<NotFound />} />
          <Route path="/home" element={<AdminPanelLandingPage />} />
          {/* <Route path="/" element={<Test />} /> */}

          {/* User paths */}
          <Route path="/users/allusers" element={<ViewUsers />} />
          <Route path="/users/create" element={<CreateUserAdmin />} />
          <Route path="/users/edit/:userId" element={<EditUserAdmin />} />

          {/* Example paths */}
          {/* <Route path="/users/create" element={<CreateUser />} />
                <Route path="/locations/view" element={<ViewLocations />} />
                <Route path="/locations/:id" element={<ViewSpecificLocation />} />
                <Route path="/locations/create" element={<CreateLocation />} />
                <Route path="/locations/edit/:id" element={<EditLocation />} />
                <Route path="/users/:id" element={<EditUser />} />
                <Route path="/products" element= {<ViewProducts />}/>
                <Route path="/products/create" element= {<CreateProduct />}/>
                <Route path="/products/:id" element= {<EditProduct />}/>
                <Route path="/bicycle" element={<BicycleAdmin />} />
                <Route path="/bicycle/view" element={<ViewBicycle />} />
                <Route path="/bicycle/add" element={<AddBicycle />} />
                <Route path="/bicycle/:id" element={<EditBicycle />} />
                <Route path="/bicycle/panel" element={<BicyclePanel />} />
                <Route path="/bicycle/details/:id" element={<BicycleDetails />} />
                <Route path="/requests/viewAll" element={<ViewAllRequests />} />
                <Route path="/orders" element={<ViewOrders />} />   
                <Route path="/orders/:id" element= {<ViewAdminSingleOrder />}/>
                <Route path="/orders/editstatus/:id" element= {<EditOrderStatus/>}/>
                <Route path="/refunds" element={<ViewRefunds />} />
                <Route path="/refunds/editstatus/:id" element={<ViewAdminSingleRefund />} />
                <Route path="/requests" element={<ViewAllRequests />} /> */}
        </Routes>
      </Box>
    
  );
}

export default AdminRoutes;
