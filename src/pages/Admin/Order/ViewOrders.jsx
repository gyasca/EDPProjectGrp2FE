import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import http from "../../../http";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminPageTitle from "../../../components/AdminPageTitle";
import VisibilityIcon from '@mui/icons-material/Visibility';


function ViewOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrders = () => {
        setLoading(true);
        http.get('/Admin/Order/')
            .then(response => {
                const nonPendingOrders = response.data.$values.filter(order => order.OrderStatus !== 'Pending');
                const sortedOrders = nonPendingOrders.sort((a, b) => b.Id - a.Id);
                setOrders(sortedOrders);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                toast.error('Error fetching orders: ' + error.message);
            })
            .finally(() => setLoading(false));
    };


    useEffect(() => {
        fetchOrders();
    }, []);

    const columns = [
        { field: 'Id', headerName: 'ID', width: 100 },
        { field: 'UserId', headerName: 'User ID', width: 100 },
        {
            field: 'OrderDate',
            headerName: 'Order Date',
            width: 180,
            valueFormatter: (params) => {
                const date = new Date(params.value);
                const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                const formattedTime = `${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}:${(date.getSeconds() < 10 ? '0' : '') + date.getSeconds()}`;
                return `${formattedDate} ${formattedTime}`;
            }
        }
        , {
            field: 'OrderStatus', headerName: 'Status', width: 150,
            renderCell: (params) => (
                <div style={{ color: 'red' }}>
                    {params.value}
                </div>
            ),
        },
        {
            field: 'TotalAmount',
            headerName: 'Total Amount',
            width: 120,
            valueFormatter: (params) => {
                const amount = parseFloat(params.value).toFixed(2);
                return `$${amount}`;
            }
        }, { field: 'NoOfItems', headerName: 'Items Count', width: 130, },
        { field: 'OrderPaymentMethod', headerName: 'Payment Method', width: 150 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    disabled={params.row.OrderStatus === 'Order Received'}
                    onClick={() => navigate(`/admin/orders/edit/${params.id}`)}
                />
                ,
                <GridActionsCellItem
                    icon={<VisibilityIcon />}
                    label="View"
                    onClick={() => {
                        navigate(`/admin/orders/${params.id}`)
                    }}
                />,
            ],
        }

    ];



    return (
        <Container>
            <ToastContainer />
            <AdminPageTitle title="All Orders" subtitle="Manage orders" backbutton />

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                        <DataGrid
                            rows={orders}
                            columns={columns}
                            pageSize={10}
                            loading={loading}
                            autoHeight
                            getRowId={(row) => row.Id}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <ToastContainer />

        </Container>
    );
}

export default ViewOrders;
