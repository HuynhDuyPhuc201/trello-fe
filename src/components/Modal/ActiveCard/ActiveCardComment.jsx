import moment from 'moment'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import { useUser } from '~/redux/user/userSlice'
import { memo, useRef, useState } from 'react'
import { Button, Pagination } from '@mui/material'
import { useCardComment } from '~/redux/activeCard/activeCardSlice'

const ActiveCardComment = memo(({ onAddCardComment, onDeleteCardComment, onEditCardComment }) => {
  const { currentUser } = useUser()
  const [idComment, setIdComment] = useState(null)
  const valueEditComment = useRef(null)
  const cardComments = useCardComment()

  const handleAddCardComment = async (event) => {
    // Bắt hành động người dùng nhấn phím Enter && không phải hành động Shift + Enter
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Thêm dòng này để khi Enter không bị nhảy dòng
      if (!event.target?.value) return // Nếu không có giá trị gì thì return không làm gì cả

      // Tạo một biến commend data để gửi api
      const commentToAdd = {
        createdBy: currentUser?._id,
        content: event.target.value.trim()
      }
      try {
        const result = await onAddCardComment(commentToAdd)
        if (result?.success) {
          setIdComment(null)
          event.target.value = ''
        }
      } catch (error) {
        console.log('error', error)
      }
    }
  }

  const onKeyDownEditCardComment = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      const value = event.target.value || valueEditComment.current
      event.preventDefault() // Thêm dòng này để khi Enter không bị nhảy dòng
      if (!value) return

      // chỗ này có async await là vì
      // nếu không dùng await thì trước khi comment được update, nó sẽ có tình trạng "giật UI"
      // nghĩa là nó sẽ chớp nháy lại comment cũ trước khi update
      // vì do setIdComment cùng lúc mà không đợi kết quả trả về từ onEditCardComment
      const result = await onEditCardComment(idComment, value) // xử lý như bình thường
      if (result?.success) {
        setIdComment(null)
      }
    }
  }

  const handleEditCardComment = async () => {
    const value = valueEditComment.current
    if (!value) return

    // tương tự comment trên
    const result = await onEditCardComment(idComment, value)
    if (result?.success) {
      setIdComment(null)
    }
  }

  const [currentPage, setCurrentPage] = useState(1)
  const COMMENTS_PER_PAGE = 5
  const totalComments = cardComments || []
  const totalPages = Math.ceil(totalComments.length / COMMENTS_PER_PAGE)

  const paginatedComments = totalComments.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE)
  const handleChangePage = (event, value) => {
    setCurrentPage(value)
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Xử lý thêm comment vào Card */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Avatar sx={{ width: 36, height: 36, cursor: 'pointer' }} alt="trungquandev" src={currentUser.avatar} />
        <TextField
          fullWidth
          placeholder="Write a comment..."
          type="text"
          variant="outlined"
          multiline
          style={{ background: '#fff' }}
          onKeyDown={handleAddCardComment}
          sx={{
            '& .MuiInputBase-root': {
              padding: '8px'
            },
            '& .MuiInputBase-input': {
              padding: '0px !important' // tránh padding mặc định của MUI
            }
          }}
        />
      </Box>

      {/* Hiển thị danh sách các comments */}
      {paginatedComments.length === 0 && (
        <Typography sx={{ pl: '45px', fontSize: '14px', fontWeight: '500', color: '#b1b1b1' }}>
          No activity found!
        </Typography>
      )}
      {paginatedComments?.map((comment, index) => (
        <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5 }} key={index}>
          <Tooltip title={currentUser?.displayName}>
            <Avatar
              sx={{ width: 36, height: 36, cursor: 'pointer', borderRadius: '50%' }}
              alt="trungquandev"
              src={currentUser?.avatar}
            />
          </Tooltip>
          <Box sx={{ width: 'inherit' }}>
            <Typography variant="span" sx={{ fontWeight: '600', mr: 1 }}>
              {currentUser?.displayName}
            </Typography>

            <Typography variant="span" sx={{ fontSize: '12px' }}>
              {moment(comment?.commentedAt).format('llll')}
            </Typography>

            {idComment === comment?._id ? (
              <TextField
                style={{ background: '#fff' }}
                fullWidth
                placeholder="Edit comment..."
                type="text"
                variant="outlined"
                multiline
                defaultValue={comment.content}
                onKeyDown={onKeyDownEditCardComment}
                onChange={(event) => (valueEditComment.current = event.target.value)}
                sx={{
                  '& .MuiInputBase-root': {
                    padding: '8px'
                  },
                  '& .MuiInputBase-input': {
                    padding: '0px !important' // tránh padding mặc định của MUI
                  }
                }}
              />
            ) : (
              <Box
                sx={{
                  display: 'block',
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33485D' : 'white'),
                  p: '8px 12px',
                  mt: '4px',
                  border: '0.5px solid rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px',
                  wordBreak: 'break-word',
                  boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.3)'
                }}
              >
                {comment?.content}
              </Box>
            )}
            {idComment !== comment?._id ? (
              <Box
                sx={{
                  fontSize: '12px',
                  color: '#b1b1b1',
                  marginTop: '4px',
                  display: 'flex',
                  gap: 1,
                  paddingLeft: '5px'
                }}
              >
                <Typography
                  variant="span"
                  sx={{ fontSize: '12px', cursor: 'pointer' }}
                  onClick={() => setIdComment(comment?._id)}
                >
                  Edit
                </Typography>
                •
                <Typography
                  variant="span"
                  sx={{ fontSize: '12px', cursor: 'pointer' }}
                  onClick={() => onDeleteCardComment(comment)}
                >
                  Delete
                </Typography>
              </Box>
            ) : (
              <Box sx={{ fontSize: '12px', marginTop: '4px', display: 'flex', gap: 1 }}>
                <Button
                  sx={{ fontSize: '12px', cursor: 'pointer' }}
                  variant="contained"
                  onClick={handleEditCardComment}
                >
                  Edit
                </Button>
                <Button
                  sx={{ fontSize: '12px', cursor: 'pointer' }}
                  variant="contained"
                  onClick={() => setIdComment(null)}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      ))}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
        </Box>
      )}
    </Box>
  )
})

export default ActiveCardComment
