import React, { useEffect } from "react";
import { validateUser } from "../../functions/user";
import { useSnackbar } from "notistack";
import { Routes, Route, useNavigate } from "react-router-dom";
import CreateTicket from "./CreateTicket";
import Chat from './Chat';
import ChatComponent from './ChatComponent'

function TicketRoutes() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!validateUser()) {
      enqueueSnackbar("You must be logged in to view this page", {
        variant: "error",
      });
      return navigate("/login");
    }
  }, []);

  return (
    <Routes>
      <Route path={"tickets/chat/:id"} element={<Chat />} />
      <Route path={"tickets/create"} element={<CreateTicket />} />
    </Routes>
  );
}

export default TicketRoutes;