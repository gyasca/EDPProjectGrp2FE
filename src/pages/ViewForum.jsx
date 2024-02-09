import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function ViewForum() {
    const [forumPosts, setForumPosts] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getForumPosts = () => {
        http.get('/forumpost').then((res) => {
            setForumPosts(res.data);
        });
    };

    const searchForumPosts = () => {
        http.get(`/forumpost?search=${search}`).then((res) => {
            setForumPosts(res.data);
        });
    };

    useEffect(() => {
        getForumPosts();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchForumPosts();
        }
    };

    const onClickSearch = () => {
        searchForumPosts();
    }

    const onClickClear = () => {
        setSearch('');
        getForumPosts();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Forum Posts
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search post by Title"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                    user && (
                        <Link to="/forum/create" style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Add Post
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    forumPosts.map((post, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={post.PostId}>
                                <Card>
                                    <CardContent>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Typography variant="h6">
                                            {post.title}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography>
                                            {post.content}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography color="text.secondary">
                                            {post.User?.email}
                                        </Typography>
                                    </Box>

                                    

                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography color="text.secondary">
                                            {dayjs(post.dateCreated).format(global.datetimeFormat)}
                                        </Typography>
                                    </Box>
                                    
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}

export default ViewForum;
