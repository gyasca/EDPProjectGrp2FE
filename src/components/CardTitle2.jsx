import React from 'react';
import { Typography, Stack, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PropTypes from 'prop-types';

function CardTitle(props) {
    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            {props.back && (
                <IconButton onClick={props.onBackClick}>
                    <ArrowBackIcon />
                </IconButton>
            )}
            {props.icon}
            <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                {props.title}
            </Typography>
        </Stack>
    );
}

CardTitle.propTypes = {
    back: PropTypes.bool,
    onBackClick: PropTypes.func,
    icon: PropTypes.node,
    title: PropTypes.string.isRequired,
};

export default CardTitle;
