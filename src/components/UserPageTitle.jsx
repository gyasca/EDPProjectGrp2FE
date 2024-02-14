import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function UserPageTitle(props) {
    const navigate = useNavigate()
    return (
        <Box sx={{ display: "flex", alignItems: "center", marginY: "1rem" }}>
            {props.backbutton && <IconButton size="large" onClick={() => navigate(-1)} sx={{ marginRight: "1rem" }}><ArrowBackIcon /></IconButton>}
            <Typography variant="h4" fontWeight={700}>{props.title}</Typography>
        </Box>
    )
}

export default UserPageTitle
