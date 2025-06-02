import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'
import { EMAIL_RULE, FIELD_REQUIRED_MESSAGE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { inviteService } from '~/services/invite.service'
import { getInvite } from '~/redux/notifications/notificationsSlice'
import { useDispatch } from 'react-redux'
import socket from '~/sockets'
import {
  Avatar,
  Badge,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Tab,
  Tabs
} from '@mui/material'
import { BOARD_INVITATION_STATUS, imageAvatar, INVITATION_TYPES } from '~/config/constants'
import { addJoinRequest, getJoinRequests, updateJoinRequest, useJoinRequests } from '~/redux/request/joinRequestSlice'
import { useUser } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'
import { getBoardAll, updateMemberBoardBar } from '~/redux/activeBoard/activeBoardSlice'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
function InviteBoardUser({ board }) {
  /**
   * Xử lý Popover để ẩn hoặc hiện một popup nhỏ, tương tự docs để tham khảo ở đây:
   * https://mui.com/material-ui/react-popover/
   */
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const dispatch = useDispatch()
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }
  const { currentUser } = useUser()
  const { joinRequests } = useJoinRequests()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()
  const submitInviteUserToBoard = async (data) => {
    const { inviteeEmail } = data
    try {
      const res = await inviteService.inviteUserToBoard({ inviteeEmail, boardId: board._id })

      // Clear thẻ input sử dụng react-hook-form bằng setValue
      if (res) {
        dispatch(getInvite())
        setValue('inviteeEmail', null)
        setAnchorPopoverElement(null)
        socket.emit('invite_to_board', res)
      }
    } catch (error) {
      // error
    }
  }

  useEffect(() => {
    dispatch(getJoinRequests(board._id))
    if (!currentUser?._id) return

    const handleJoinRequest = (newRequest) => {
      if (newRequest && newRequest?.boardJoinRequest.boardId === board._id) {
        dispatch(addJoinRequest(newRequest))
      }
    }
    socket.on('receive_join_request', handleJoinRequest)
    return () => {
      socket.off('receive_join_request', handleJoinRequest)
    }
  }, [dispatch, currentUser?._id, board._id])

  const [tabIndex, setTabIndex] = useState(0)

  const handleTabChange = (event, newValue) => setTabIndex(newValue)

  const onApproveRejectRequest = async (request, type) => {
    const status = type === 'approve' ? BOARD_INVITATION_STATUS.ACCEPTED : BOARD_INVITATION_STATUS.REJECTED
    try {
      // nếu dùng await không thì sẽ không trả về kết quả
      // phải
      const res = await dispatch(updateJoinRequest({ requestId: request._id, status })).unwrap()
      dispatch(getJoinRequests(board._id))
      await dispatch(getBoardAll())

      socket.emit('response_join_request', {
        userId: res.approvedUserId,
        type: INVITATION_TYPES.BOARD_REQUEST_JOIN,
        message: type === 'approve' ? 'Your request join has been approved.' : 'Your request join has been denied.',
        boardId: board._id
      })
      if (type === 'approve') {
        await dispatch(updateMemberBoardBar({ user: currentUser, type: 'join' }))
        socket.emit('user_join_board', {
          boardId: board._id,
          user: currentUser
        })
      }
    } catch (error) {
      toast.error('Lỗi khi chấp thuận hoặc từ chối yêu cầu')
    }
  }

  const [currentPage, setCurrentPage] = useState(1)
  const COMMENTS_PER_PAGE = 3
  const totalPages = Math.ceil(joinRequests.length / COMMENTS_PER_PAGE)

  const paginatedJoinRequest = joinRequests.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE
  )
  const unreadCount = paginatedJoinRequest.filter(
    (n) => n?.boardJoinRequest.status === BOARD_INVITATION_STATUS.PENDING
  ).length

  const handleChangePage = (event, value) => {
    setCurrentPage(value)
  }

  return (
    <Box>
      <Badge
        badgeContent={unreadCount}
        color="error"
        invisible={unreadCount === 0}
        slotProps={{
          badge: {
            sx: {
              top: 6, // Điều chỉnh xuống (giảm số này thì lên, tăng thì xuống)
              right: 0 // Điều chỉnh sang trái/phải nếu cần
            }
          }
        }}
      >
        <Tooltip title="Invite user to this board!">
          <Button
            aria-describedby={popoverId}
            onClick={handleTogglePopover}
            variant="outlined"
            startIcon={<PersonAddIcon />}
            sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
          >
            Share
          </Button>
        </Tooltip>
      </Badge>

      {/* Khi Click vào butotn Invite ở trên thì sẽ mở popover */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <form onSubmit={handleSubmit(submitInviteUserToBoard)}>
          <Box sx={{ p: '15px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="span" sx={{ fontWeight: 'bold', fontSize: '16px' }}>
              Invite User To This Board!
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
              <TextField
                autoFocus
                fullWidth
                label="Enter email to invite..."
                type="text"
                variant="outlined"
                {...register('inviteeEmail', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
                })}
                error={!!errors['inviteeEmail']}
              />
              <Button className="interceptor-loading" type="submit" variant="contained" color="info">
                Invite
              </Button>
            </Box>
            <FieldErrorAlert errors={errors} fieldName={'inviteeEmail'} />
          </Box>
        </form>
        <Box sx={{ mt: 2, px: 2 }}>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Tabs for members and requests">
            <Tab label={`Members (${board?.allUsers.length})`} />
            {currentUser._id === board.ownerIds?.[0] && currentUser.role === 'admin' && (
              <Tab label={`Request to join (${joinRequests.length})`} />
            )}
          </Tabs>

          <Divider sx={{ mb: 1 }} />

          {/* Tab 1: Thành viên */}
          {tabIndex === 0 && (
            <List dense>
              {board?.allUsers?.map((member) => (
                <ListItem key={member?._id}>
                  <ListItemAvatar>
                    <Avatar alt={member?.displayName} src={imageAvatar(member)} sx={{ width: 40, height: 40 }} />
                  </ListItemAvatar>
                  <ListItemText primary={member?.displayName} secondary={`${member?.email} • ${member?.role}`} />
                </ListItem>
              ))}
            </List>
          )}

          {/* Tab 2: Yêu cầu tham gia */}
          {currentUser._id === board.ownerIds?.[0] && currentUser.role === 'admin' && tabIndex === 1 && (
            <>
              <List dense>
                {paginatedJoinRequest?.map((request, index) => (
                  <Box key={index}>
                    <ListItem key={request._id}>
                      <ListItemAvatar>
                        <Avatar
                          alt={request?.user.displayName}
                          src={imageAvatar(request?.user) || request?.user.avatar}
                          sx={{ width: 40, height: 40 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={request?.user?.displayName}
                        secondary={`${request?.user?.email} • ${request?.user?.role}`}
                      />
                    </ListItem>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'end' }}>
                      {request.boardJoinRequest.status === BOARD_INVITATION_STATUS.PENDING && (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'end' }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => onApproveRejectRequest(request, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => onApproveRejectRequest(request, 'reject')}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                        {request?.boardJoinRequest.status === BOARD_INVITATION_STATUS.ACCEPTED && (
                          <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />
                        )}
                        {request?.boardJoinRequest.status === BOARD_INVITATION_STATUS.REJECTED && (
                          <Chip icon={<NotInterestedIcon />} label="Rejected" size="small" />
                        )}
                      </Box>
                    </Box>
                    {index !== joinRequests?.length - 1 && <Divider sx={{ py: 1 }} />}
                  </Box>
                ))}
              </List>
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
                  <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
                </Box>
              )}
            </>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default InviteBoardUser
