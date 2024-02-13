import React, { useEffect } from 'react';
import ChatComponent from './ChatComponent';
import { validateUser } from "../../functions/user";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Chat = () => {
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
        <div>
            <ChatComponent />
        </div>
    );
};

export default Chat;
