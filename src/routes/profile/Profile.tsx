import React, { lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { 
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Stack
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout, userSelector } from '../../redux/modules/user';
import { loadPosts, postSelector } from '../../redux/modules/posts';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/layout/loading/Loading';

const PostCard = lazy(() => import('../../components/post-card/Post-card'))

const ProfilePage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { posts, loading } = useAppSelector(postSelector)
  const user = useAppSelector(userSelector)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const postList = useMemo(() => (
    posts?.items?.map((post) => (
        <PostCard key={post.uuid} data={post} />
    )).reverse() || []
  ), [posts?.items])

  const handleLogout = () => {
    dispatch(logout())
    navigate("/authorization")
  }
  
    const loadMorePosts = useCallback(() => {
      if (!loading && hasMore && localStorage.getItem('jwtToken')) {
        dispatch(loadPosts(undefined, undefined, page, 10))
        setPage(prev => prev + 1)
      }
    }, [dispatch, page, loading, hasMore])
  
    useEffect(() => {
      if(localStorage.getItem('jwtToken') !== null) {
        dispatch(loadPosts(user.data?.username, undefined, 1, 10))
      }
    }, [dispatch])

    useEffect(() => {
      if(posts?.pagination) {
        setHasMore(posts.pagination.currentPage < posts.pagination.totalPages)
      }
    }, [posts?.pagination])

    useEffect(() => {
      const handleScroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop + 400 >= 
          document.documentElement.offsetHeight && hasMore
        ) {
          loadMorePosts()
        }
      }
  
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [loadMorePosts, hasMore])

  return (
    <Container sx={{ padding: 0 }}>
      <Stack spacing={4} sx={{ padding: 0 }}>
        
        <Grid>
          <Card>
            <CardHeader
              title="Profile"
            />
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Avatar
                  //src={profile.avatarUrl}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography variant="h5" component="div">
                  {user.data?.username}
                </Typography>
                <Button variant="outlined" color="error" sx={{ alignSelf: 'end' }} onClick={handleLogout}>Logout</Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={''} />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText primary="Phone" secondary={''} />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon />
                  </ListItemIcon>
                  <ListItemText primary="Location" secondary={''} />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText primary="Member since" secondary={''} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        
          <Card  sx={{ padding: 0, backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardHeader title="My posts" />
            <CardContent sx={{ padding: 0, backgroundColor: 'transparent', gap: '20px', display: 'flex', flexFlow:'column' }}>
              {localStorage.getItem('jwtToken') !== null ? (
                <>
                  {postList}
                  {loading && <Loading />}
                  {!hasMore && <div>No more posts to load</div>}
                </>
              ) : (
                <div>
                  No posts found
                  Be the first to share something!
                </div>
              )}
            </CardContent>
          </Card>
      </Stack>
    </Container>
  );
};

export default ProfilePage;