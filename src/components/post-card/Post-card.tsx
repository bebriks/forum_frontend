import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Post } from '../../api/types';
import { Button, MenuItem, Popover, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deletePost, updatePost } from '../../redux/modules/posts';
import { userSelector } from '../../redux/modules/user';
import { dateFormatter } from '../../utils/converters';
import { useState } from 'react';

export default function PostCard({ data }: { data: Post }) {
  const user = useAppSelector(userSelector)
  const dispatch = useAppDispatch()
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const [title, setTitle] = useState(data.title)
  const [content, setContent] = useState(data.content)

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePostDelete = () => {
    dispatch(deletePost(data.uuid))
  }

  const handlePostUpdate = () => {
    setEditing(true)
  }
  
  function handleUpdatePost() {
    const updatingPost = {
      uuid: data.uuid,
      title: title,
      content: content,
    }
    if(window.location.pathname === '/profile') {
      dispatch(updatePost(updatingPost, data.username))
    } else {
      dispatch(updatePost(updatingPost))
    }
  }


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    !editing ?
    (<Card sx={{ display: 'flex', flexFlow: 'column wrap' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {data.username[0]}
          </Avatar>
        }
        action={ data.username === user.data?.username ? 
          <>
          <Button aria-describedby={id} variant="contained" onClick={handleClick}>
            <MoreVertIcon />
          </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem><Button variant="outlined" color="primary" onClick={handlePostUpdate}>Update</Button></MenuItem>
              <MenuItem><Button variant="outlined" color="error" onClick={handlePostDelete}>Delete</Button></MenuItem>
            </Popover>
          </>
          : ''
        }
        title={data.username}
        subheader={dateFormatter(data.createdAt)}
      />
      <CardContent>
        <Typography sx={{ marginBottom: 2 }}>
          {data.title}
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>
          {data.content}
        </Typography>
        </CardContent>
    </Card>) : (
      <Card sx={{ display: 'flex', flexFlow: 'column wrap' }}>
      <CardContent sx={{ display: 'flex', flexFlow: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
            {data.createdAt}
        </Typography>
        <TextField
          id="post-title"
          label="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          variant="outlined"
          slotProps={{ htmlInput: { maxLength: 80 } }}
        />
        
        <TextField
          id="post-content"
          label="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          slotProps={{ htmlInput: { maxLength: 255 } }}
        />
        
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <IconButton
            onClick={() => {
              handleExpandClick()
              handleUpdatePost()
              setEditing(false)
              setAnchorEl(null)
            }}
            aria-label="update post"
            disabled={!title.trim() || !content.trim()}
          >
            Save
          </IconButton>
        </CardActions>
      </CardContent>
    </Card>
    )
  )
}