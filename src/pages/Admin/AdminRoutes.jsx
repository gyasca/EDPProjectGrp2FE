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
import ViewEvents from "./Event/ViewEvents";
import AddEvent from "./Event/AddEvent";
import EditEvent from "./Event/EditEvent";

// order
import ViewOrders from "./Order/ViewOrders";
import EditOrderStatus from "./Order/EditOrderStatus";
import ViewSpecificOrder from "./Order/ViewSpecificOrder";

// refund
import ViewRefunds from "./Refund/ViewRefunds";
import UpdateRefund from "./Refund/UpdateRefund";

// ticketo
import Chat from "../Tickets/Chat";
import TicketPage from "./Tickets/TicketPage";
import TicketPageInd from "./Tickets/TicketPageInd";

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
          <Route path="/users/edit/:userId/editor/:adminId" element={<EditUserAdmin />} />

          {/* Ticket paths */ }
          <Route path={"/tickets"} element={<TicketPage />} />
          <Route path={"/tickets/:id"} element={<TicketPageInd />} />

          {/* Event paths */}
          <Route path="/events" element={<ViewEvents />} />
          <Route path="/events/add" element={<AddEvent />} />
          <Route path="/events/edit/:id" element={<EditEvent />} />

          {/* Order paths */}
          <Route path="/orders" element={<ViewOrders />} />
          <Route path="/orders/edit/:id" element={<EditOrderStatus />} />
          <Route path="/orders/:id" element={<ViewSpecificOrder />} />

          {/* Refund paths */}
          <Route path="/refunds" element={<ViewRefunds />} />
          <Route path="/refunds/edit/:id" element={<UpdateRefund />} />

          {/* Chat paths */}
        </Routes>
      </Box>
    
  );
}

export default AdminRoutes;
