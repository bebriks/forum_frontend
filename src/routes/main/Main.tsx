import { lazy, Suspense, useEffect, useMemo, useState, useCallback } from 'react'
import '../../App.scss'
import Loading from '../../components/layout/loading/Loading'
import PostCardNew from '../../components/post-card/Post-card-new'
import { Box, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from "../../hooks"
import { loadPosts, postSelector } from '../../redux/modules/posts'

const PostCard = lazy(() => import('../../components/post-card/Post-card'))

function Main() {
  const { posts, loading } = useAppSelector(postSelector)
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const postList = useMemo(() => (
    posts?.items?.map((post) => (
      <PostCard key={post.uuid} data={post} />
    )) || []
  ), [posts?.items])

  const loadMorePosts = useCallback(() => {
    if (!loading && hasMore && localStorage.getItem('jwtToken')) {
      dispatch(loadPosts(undefined, undefined, page, 10))
      setPage(prev => prev + 1)
    }
  }, [dispatch, page, loading, hasMore])

  useEffect(() => {
    if(localStorage.getItem('jwtToken') !== null) {
      dispatch(loadPosts(undefined, undefined, 1, 10))
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
    <Box component="main" sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Suspense fallback={<Loading />}>
        <Stack direction="column" spacing={3}>
          <PostCardNew />
          
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
        </Stack>
      </Suspense>
    </Box>
  )
}

export default Main