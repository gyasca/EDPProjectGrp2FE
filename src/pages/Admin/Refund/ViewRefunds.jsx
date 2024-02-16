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


function ViewRefunds() {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchRefunds = () => {
        setLoading(true);
        http.get('/Admin/Refund/') 
            .then(response => {
                const sortedRefunds = response.data.sort((a, b) => b.id - a.id);
                setRefunds(sortedRefunds);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching refunds:', error);
                toast.error('Error fetching refunds: ' + error.message);
            })
            .finally(() => setLoading(false));
    };


    useEffect(() => {
        fetchRefunds();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        {
            field: 'user.email',
            headerName: 'User Email',
            width: 300,
            valueGetter: (params) => params.row.user.email
        }, {
            field: 'requestRefundDate',
            headerName: 'Refund Request Date',
            width: 180,
            valueFormatter: (params) => {
                const date = new Date(params.value);
                const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                const formattedTime = `${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}:${(date.getSeconds() < 10 ? '0' : '') + date.getSeconds()}`;
                return `${formattedDate} ${formattedTime}`;
            }
        },
        {
            field: 'refundStatus', headerName: 'Refund Status', width: 150,
            renderCell: (params) => (
                <div style={{ color: 'red' }}>
                    {params.value}
                </div>
            ),
        },
        {
            field: 'refundAmount',
            headerName: 'Refund Amount',
            width: 150,
            valueFormatter: (params) => {
                const amount = parseFloat(params.value).toFixed(2);
                return `$${amount}`;
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                onClick={() => navigate(`/admin/refunds/edit/${params.id}`)}
                />,
            ],
        }
    ];

    return (
        <Container>
            <ToastContainer />
            <AdminPageTitle title="All Refunds" subtitle="Manage refunds" backbutton />

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                        <DataGrid
                            rows={refunds}
                            columns={columns}
                            pageSize={10}
                            loading={loading}
                            autoHeight
                            getRowId={(row) => row.id}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <ToastContainer />
        </Container>
    );
}

export default ViewRefunds;
