import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { PlusIcon } from '../icons/icons';
import { TextField, Tooltip } from '@mui/material';
import { createPost } from '../../redux/modules/posts';
import { useAppDispatch } from '../../hooks';
import { useState } from 'react';

export default function PostCardNew() {
  const dispatch = useAppDispatch()
  const [expanded, setExpanded] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  function handleAddPost() {
    const newPost = {
      title: title,
      content: content,
    }
    dispatch(createPost(newPost))
    setTitle("")
    setContent("")
  }

  return (
    <Card sx={{ display: 'flex', flexFlow: 'column wrap' }}>
      <CardContent sx={{ display: 'flex', flexFlow: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          Type something new:
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
              handleAddPost()
            }}
            aria-label="create post"
            disabled={!title.trim() || !content.trim()}
          >
            <Tooltip title="Create Post">
              <PlusIcon />
            </Tooltip>
          </IconButton>
        </CardActions>
      </CardContent>
    </Card>
  )
}