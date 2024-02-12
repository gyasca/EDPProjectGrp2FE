import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import * as yup from 'yup';
import http from '../../http';

function CreateForumPost() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            postTopic: "", // Add PostTopic field
            title: "",
            content: "",
            votes: "0",            
        },
        validationSchema: yup.object({
            postTopic: yup.string().required('Post Topic is required'), // Validate PostTopic
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            content: yup.string().trim()
                .min(3, 'Content must be at least 3 characters')
                .max(500, 'Content must be at most 500 characters')
                .required('Content is required')
        }),
        onSubmit: (data) => {
            // Ensure values is defined
            if (!data) {
                console.error("Form values are undefined.");
                return;
            }
            data.postTopic = data.postTopic
            data.title = data.title
            data.content = data.content
            data.votes = data.votes
            console.log(data);


            http.post("/forumpost", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/forum/view");
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                    console.log(`${err.response.data.message}`);
                });
        }
    });

    return (
        <Box
        sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Create Forum Post
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={formik.handleSubmit}>

                <TextField
                    fullWidth
                    id="postTopic"
                    name="postTopic"
                    label="Post Topic"
                    select
                    variant="outlined"
                    value={formik.values.postTopic}
                    onChange={formik.handleChange}
                    error={formik.touched.postTopic && Boolean(formik.errors.postTopic)}
                    helperText={formik.touched.postTopic && formik.errors.postTopic}
                    sx={{ marginY: "1rem" }}
                    >
                    <MenuItem value="question">Question</MenuItem>
                    <MenuItem value="recommendation">Recommendation</MenuItem>
                </TextField>

                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    multiline minRows={2}
                    label="Content"
                    name="content"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    error={formik.touched.content && Boolean(formik.errors.content)}
                    helperText={formik.touched.content && formik.errors.content}
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default CreateForumPost;
