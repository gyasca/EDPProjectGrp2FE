import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import http from '../../../http';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminPageTitle from '../../../components/AdminPageTitle';

const UpdateRefund = () => {
    const { id } = useParams();
    const [refund, setRefund] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchRefund() {
            try {
                const response = await http.get("/admin/refund/" + id);
                setRefund(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching refund:', error.response.data.message, error.response.status);
                toast.error('Error fetching refund: ' + error.response.data.message);
            }
        }

        fetchRefund();
    }, []);

    const handleApprove = async () => {
        try {
            const response = await http.put('/admin/refund/', {
                refundId: id,
                newStatus: 'Refund Approved'
            });
            toast.success('Refund approved successfully!');
            navigate('/admin/refunds');
        } catch (error) {
            console.error('Error approving refund request:', error.response.data.message, error.response.data.errors, error.response.data.stackTrace);
            toast.error('Error approving refund: ' + error.response.data.message);
        }
    }
    
    const handleReject = async () => {
        try {
            const response = await http.put('/admin/refund/', {
                refundId: id,
                newStatus: 'Refund Rejected'
            });
            toast.success('Refund rejected successfully!');
            navigate('/admin/refunds');
        } catch (error) {
            console.error('Error rejecting refund request:', error.response.data.message, error.response.data.errors, error.response.data.stackTrace);
            toast.error('Error rejecting refund: ' + error.response.data.message);
        }
    }


    if (!refund) {
        return 'Loading...';
    }

    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
            <AdminPageTitle title="Refund details" subtitle="Edit refunds" backbutton />
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ padding: 2 }}>
                        <Typography variant="h6">Refund Information</Typography>
                        <Typography variant="body1">Refund ID: {refund.id}</Typography>
                        <Typography variant="body1">For Order ID: {refund.orderId}</Typography>
                        <Typography variant="body1">Refund Reason: {refund.refundReason}</Typography>
                        <Typography variant="body1">Created On: {new Date(refund.requestRefundDate).toLocaleDateString()}</Typography>
                        <Button component={Link} variant="contained" color="primary" sx={{ marginBottom: "1rem" }} startIcon={<VisibilityIcon />} to={`/admin/orders/${refund.orderId}`}>View Order</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
                        <Typography variant="h6">Approve This Request?</Typography>
                        <Typography variant="body2">By approving this refund request, the customer order will be cancelled and an e-mail will be sent to the customer about the refund.</Typography>
                        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleApprove}>Approve Refund</Button>                    
                    </Paper>
                    <Paper elevation={2} sx={{ padding: 2 }}>
                        <Typography variant="h6">Reject This Request?</Typography>
                        <Typography variant="body2">By rejecting this refund request, the customer will be informed and the order will proceed as originally placed.</Typography>
                        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleReject}>Reject Refund</Button>                    
                    </Paper>
                </Grid>
            </Grid>
            <ToastContainer />
        </Container>
    );
};

export default UpdateRefund;
