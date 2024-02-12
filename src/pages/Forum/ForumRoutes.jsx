import React, { useEffect } from "react";
import { validateUser } from "../../functions/user";
import { useSnackbar } from "notistack";
import { Routes, Route, useNavigate } from "react-router-dom";
import CreateForumPost from "./CreateForumPost";
import ViewForum from "./ViewForum";

function ForumRoutes() {
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
      <Route path={"/create"} element={<CreateForumPost />} />
      <Route path={"/view"} element={<ViewForum />} />
    </Routes>
  );
}

export default ForumRoutes;
