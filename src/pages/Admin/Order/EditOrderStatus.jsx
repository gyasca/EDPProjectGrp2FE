import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Typography, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import http from '../../../http';
import AdminPageTitle from '../../../components/AdminPageTitle';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function EditOrderStatus() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState("");
    const delivery_status = {
        // 1: "Order Processing",
        2: "Waiting for delivery",
        3: "Order Delivered",
        // 4: "Received",
        // 5: "Cancelled",
        // 6: "Refunded",
    };

    useEffect(() => {
        async function fetchOrder() {
            try {
                const response = await http.get("/admin/order/" + id);
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        }
        fetchOrder();
    }, [id]);

    if (!order) {
        return 'Loading...';
    }

    const handleChange = (event) => {
        setStatus(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await http.put("/admin/order/" + id, { NewStatus: delivery_status[status] });
            setOrder(response.data);
            toast.success('Order status successfully updated');
            setStatus("");
            navigate("/admin/orders");
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error in updating order status';
            toast.error(errorMessage);
            console.error('Error updating status:', error);
        }
    };
    

    return (
        <Container maxWidth="xl" sx={{ marginY: "1rem", minWidth: 0 }}>
            <AdminPageTitle title="Edit Order Status" subtitle={`Order ID: ${id}`} backbutton />
            <LoadingButton
                variant="contained"
                color="primary"
                type="submit"
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                sx={{ marginBottom: "1rem" }}
            >
                Update Status
            </LoadingButton>

            <Paper sx={{ padding: "2rem", marginTop: "1rem" }}>
                <FormControl fullWidth>
                    <InputLabel id="status-select-label">Order Status</InputLabel>
                    <Select
                        labelId="status-select-label"
                        id="status-select"
                        value={status}
                        label="Order Status"
                        onChange={handleChange}
                    >
                        {Object.entries(delivery_status).map(([key, value]) => (
                            <MenuItem key={key} value={key}>{value}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>
            <ToastContainer />

        </Container>
        
    );
}

export default EditOrderStatus;
