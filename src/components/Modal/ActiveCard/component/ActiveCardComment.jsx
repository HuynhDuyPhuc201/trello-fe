import moment from 'moment'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import { useUser } from '~/redux/user/userSlice'
import { memo, useCallback, useRef, useState } from 'react'
import { Button, Pagination } from '@mui/material'
import { useActiveCard, useCardComment } from '~/redux/activeCard/activeCardSlice'
import { toast } from 'react-toastify'
import { imageAvatar } from '~/config/constants'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import { useFetchUpdateCard } from '~/hooks/useFetchUpdateCard'
import TitleActiveCard from './TitleActiveCard'

const ActiveCardComment = memo(() => {
  const { currentUser } = useUser()
  const [idComment, setIdComment] = useState(null)
  const valueEditComment = useRef(null)
  const cardComments = useCardComment()
  const { currentActiveCard } = useActiveCard()
  const { fetchUpdateCard } = useFetchUpdateCard()

  const handleEditComment = useCallback(
    (commentId, valueEditComment) => {
      const listCommentEdited = currentActiveCard?.comments.map((comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            content: valueEditComment,
            commentedAt: Date.now()
          }
        }
        return comment
      })
      return fetchUpdateCard({ comments: listCommentEdited })
    },
    [fetchUpdateCard, currentActiveCard?.comments]
  )
  const handleDeleteComment = (comment) => {
    if (comment.user?._id === currentUser._id) {
      const commentToAdd = {
        ...comment,
        action: 'remove'
      }
      return fetchUpdateCard({ commentToAdd })
    } else {
      toast.warning("You can't delete this comment")
    }
  }
  const handleAddCardComment = async (event) => {
    // Bắt hành động người dùng nhấn phím Enter && không phải hành động Shift + Enter
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Thêm dòng này để khi Enter không bị nhảy dòng
      if (!event.target?.value) return 

      const commentToAdd = {
        user: currentUser,
        content: event.target.value.trim(),
        action: 'add'
      }
      try {
        const result = await fetchUpdateCard({ commentToAdd })
        if (result?.success) {
          setIdComment(null)
          event.target.value = ''
        }
      } catch (error) {
        toast.error('Failed to add comment. Please try again.')
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
      // vì do setIdComment cùng lúc mà không đợi kết quả trả về từ handleEditComment
      const result = await handleEditComment(idComment, value) // xử lý như bình thường

      if (result?.success) {
        setIdComment(null)
      }
    }
  }

  const handleEditCardComment = async () => {
    const value = valueEditComment.current
    if (!value) return
    // tương tự comment trên
    const result = await handleEditComment(idComment, value)
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
    <>
      <Box sx={{ mb: 3 }}>
        <TitleActiveCard icon={<DvrOutlinedIcon />} text="Activity" />
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 2, paddingLeft: { xs: 0, sm: 0, md: 5 } }}>
            <Avatar
              sx={{ width: 36, height: 36, cursor: 'pointer' }}
              alt={currentUser.displayName}
              src={imageAvatar(currentUser)}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder="Write a comment..."
              onKeyDown={handleAddCardComment}
              variant="outlined"
              size="small"
              style={{ background: (theme) => (theme.palette.mode === 'dark' ? '#1c1c1c' : '#fff') }}
            />
          </Box>

          {paginatedComments?.map((comment, index) => (
            <Box
              sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5, paddingLeft: { xs: 0, sm: 0, md: 5 } }}
              key={index}
            >
              <Tooltip title={comment.user?.displayName}>
                <Avatar
                  sx={{ width: 36, height: 36, cursor: 'pointer', borderRadius: '50%' }}
                  alt={comment.user?.displayName}
                  src={imageAvatar(comment.user)}
                />
              </Tooltip>
              <Box sx={{ width: 'inherit' }}>
                <Typography variant="span" sx={{ fontWeight: '600', mr: 1 }}>
                  {comment.user?.displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {moment(comment?.commentedAt).format('llll')}
                </Typography>

                {idComment === comment?._id ? (
                  <TextField
                    style={{ background: (theme) => (theme.palette.mode === 'dark' ? '#1c1c1c' : '#fff') }}
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
                        padding: '0px !important'
                      }
                    }}
                  />
                ) : (
                  <Box
                    gap={2}
                    p={1}
                    style={{ background: (theme) => (theme.palette.mode === 'dark' ? '#1c1c1c' : '#fff') }}
                    border={1}
                    borderColor="grey.300"
                    borderRadius={1}
                    boxShadow={1}
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
                      onClick={() => {
                        if (comment?.user?._id === currentUser._id) {
                          setIdComment(comment?._id)
                        } else {
                          toast.warning("You can't edit this comment")
                        }
                      }}
                    >
                      Edit
                    </Typography>
                    •
                    <Typography
                      variant="span"
                      sx={{ fontSize: '12px', cursor: 'pointer' }}
                      onClick={() => handleDeleteComment(comment)}
                    >
                      Delete
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ fontSize: '12px', marginTop: '4px', display: 'flex', gap: 1 }}>
                    <Button
                      sx={{ fontSize: '12px', cursor: 'pointer' }}
                      type="button"
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={handleEditCardComment}
                    >
                      Edit
                    </Button>
                    <Button
                      sx={{ fontSize: '12px', cursor: 'pointer' }}
                      type="button"
                      variant="contained"
                      color="info"
                      size="small"
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
      </Box>
    </>
  )
})

export default ActiveCardComment
