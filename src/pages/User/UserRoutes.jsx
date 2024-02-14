import React, { useEffect } from "react";
import { validateUser } from "../../functions/user";
import { useSnackbar } from "notistack";
import { Routes, Route, useNavigate } from "react-router-dom";
import ViewSpecificUser from "./ViewSpecificUser";
import EditUser from "./EditUser";

function UserRoutes() {
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
      <Route path={"/viewspecificuser/:userId"} element={<ViewSpecificUser />} />
      <Route path={"/edituser/:userId"} element={<EditUser />} />
    </Routes>
  );
}

export default UserRoutes;
