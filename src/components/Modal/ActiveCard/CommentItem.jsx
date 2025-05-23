import { memo, useRef, useState } from 'react'
import { Box, Typography, TextField, Tooltip, Avatar, Button } from '@mui/material'
import moment from 'moment'

const CommentItem = memo(({ comment, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const valueRef = useRef(comment.content)

  const handleEdit = async () => {
    if (!valueRef.current.trim()) return
    const result = await onEdit(comment._id, valueRef.current)
    if (result?.success) setIsEditing(false)
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5 }}>
      <Tooltip title={comment?.userDisplayName}>
        <Avatar sx={{ width: 36, height: 36 }} src={comment?.userAvatar} />
      </Tooltip>
      <Box sx={{ width: 'inherit' }}>
        <Typography variant="span" sx={{ fontWeight: 'bold', mr: 1 }}>
          {comment?.userDisplayName}
        </Typography>
        <Typography variant="span" sx={{ fontSize: '12px' }}>
          {moment(comment?.commentedAt).format('LTS')}
        </Typography>

        {isEditing ? (
          <>
            <TextField
              fullWidth
              defaultValue={comment.content}
              onChange={(e) => (valueRef.current = e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleEdit()
                }
              }}
              sx={{
                mt: 1,
                '& .MuiInputBase-root': { padding: '8px' },
                '& .MuiInputBase-input': { padding: '0px !important' }
              }}
            />
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Button size="small" onClick={handleEdit}>
                Save
              </Button>
              <Button size="small" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33485D' : 'white'),
                p: '8px 12px',
                mt: '4px',
                border: '0.5px solid rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                wordBreak: 'break-word'
              }}
            >
              {comment?.content}
            </Box>
            <Box sx={{ fontSize: '12px', mt: 0.5, display: 'flex', gap: 1 }}>
              <Typography onClick={() => setIsEditing(true)} sx={{ cursor: 'pointer' }}>
                Edit
              </Typography>
              •
              <Typography onClick={() => onDelete(comment)} sx={{ cursor: 'pointer' }}>
                Delete
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
})

export default CommentItem
