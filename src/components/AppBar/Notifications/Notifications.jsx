import { useEffect, useState } from 'react'
import moment from 'moment'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import NotificationsIcon from '@mui/icons-material/Notifications'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import {
  addNotification,
  clearNotification,
  getInvite,
  updateInvite,
  useNotification
} from '~/redux/notifications/notificationsSlice'
import { useDispatch } from 'react-redux'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/config/constants'
import { useUser } from '~/redux/user/userSlice'
import { getBoardAll } from '~/redux/activeBoard/activeBoardSlice'
import { inviteService } from '~/services/invite.service'
import { toast } from 'react-toastify'
import { path } from '~/config/path'
import { useNavigate } from 'react-router-dom'
import socket from '~/sockets'
import RenderColor from '~/components/renderColor'

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 8,
    minWidth: 350,
    maxWidth: 400,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    border: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(1)
  }
}))

const NotificationItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  borderRadius: 8,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  }
}))

const EmptyState = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

function Notifications() {
  const dispatch = useDispatch()
  const { findColor } = RenderColor()
  const { currentNotification } = useNotification()
  const { currentUser } = useUser()
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteAll = async () => {
    try {
      const result = await inviteService.deletInvite(currentUser?._id)
      if (result.success) {
        dispatch(getInvite())
        dispatch(clearNotification())
      }
    } catch (error) {
      toast.error('Failed to delete all board. Please try again.', error)
    }
  }

  useEffect(() => {
    if (!currentUser?._id) return
    dispatch(getInvite())
    const handlerResponse = (res) => {
      dispatch(addNotification(res))
    }
    const handler = (Invitation) => {
      if (Invitation.inviteeId === currentUser?._id) {
        dispatch(addNotification(Invitation))
      }
    }
    socket.on('response_join_request', handlerResponse)
    socket.on('invite_to_board', handler)
    return () => {
      socket.off('response_join_request', handlerResponse)
      socket.off('invite_to_board', handler)
    }
  }, [currentUser?._id, dispatch])

  const navigation = useNavigate()
  const updateBoardInvitation = async (status, invitationId) => {
    try {
      const updatedInvite = await dispatch(updateInvite({ status, invitationId })).unwrap()
      await dispatch(getInvite())
      await dispatch(getBoardAll())
      const checkStatus = updatedInvite.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED
      if (checkStatus) {
        const boardId = updatedInvite?.boardInvitation.boardId
        if (!boardId || !currentUser) return
        socket.emit('user_join_board', {
          boardId: boardId,
          user: currentUser
        })
        navigation(path.Board.detail.replace(':boardId', boardId))
      }
      return () => {
        dispatch(clearNotification())
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const [unreadCountRequest, setUnreadCountRequest] = useState(0)

  useEffect(() => {
    if (!currentNotification) return
    const count = currentNotification.filter((n) => n.type === INVITATION_TYPES.BOARD_REQUEST_JOIN).length
    setUnreadCountRequest(count)
  }, [currentNotification])

  const notificationOfInvitee =
    currentNotification?.filter(
      (invite) =>
        (invite.type === INVITATION_TYPES.BOARD_INVITATION && invite.inviteeId === currentUser?._id) ||
        invite?.invitee?._id === currentUser?._id
    ) || []

  const unreadCountInvite = notificationOfInvitee.filter(
    (n) => n.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING
  ).length

  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
    setUnreadCountRequest((prev) => Math.max(prev - 1, 0))
  }

  const unreadCount = unreadCountInvite + unreadCountRequest

  return (
    <Box>
      <Tooltip title="Notifications" arrow>
        <IconButton
          onClick={handleClickNotificationIcon}
          sx={{
            color: (theme) => (findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'),
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Badge
            color="error"
            badgeContent={unreadCount}
            invisible={unreadCount === 0}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                fontWeight: 'bold',
                minWidth: '18px',
                height: '18px'
              }
            }}
          >
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <StyledMenu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {(!currentNotification || currentNotification.length === 0) && (
            <EmptyState>
              <NotificationsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                No new notifications
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                You are all caught up!
              </Typography>
            </EmptyState>
          )}

          {currentNotification &&
            currentNotification?.map((notification, index) => (
              <NotificationItem key={index} elevation={0}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  {notification.type === INVITATION_TYPES.BOARD_INVITATION && (
                    <Avatar
                      sx={{
                        width: 35,
                        height: 35
                      }}
                    >
                      <GroupAddIcon />
                    </Avatar>
                  )}

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {notification.type === INVITATION_TYPES.BOARD_REQUEST_JOIN && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {notification.message.includes('approved') ? (
                          <>Your request to join has been approved.</>
                        ) : (
                          notification.message
                        )}
                      </Typography>
                    )}
                    {notification.type === INVITATION_TYPES.BOARD_INVITATION && (
                      <Box>
                        {notification?.boardInvitation?.status === BOARD_INVITATION_STATUS?.PENDING ? (
                          <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.4 }}>
                            <strong>{notification?.inviter?.displayName}</strong> invited you to join{' '}
                            <strong>{notification?.board?.title}</strong>
                          </Typography>
                        ) : notification?.boardInvitation?.status === BOARD_INVITATION_STATUS?.ACCEPTED ? (
                          <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.4 }}>
                            You accepted the invitation to <strong>{notification?.board?.title}</strong>
                          </Typography>
                        ) : (
                          <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.4 }}>
                            You rejected the invitation to <strong>{notification?.board?.title}</strong>
                          </Typography>
                        )}
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {moment(notification.createdAt).fromNow()}
                      </Typography>
                      {notification?.boardInvitation?.status === BOARD_INVITATION_STATUS?.PENDING && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'end' }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<DoneIcon />}
                            onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS?.ACCEPTED, notification?._id)}
                            sx={{ borderRadius: 1, textTransform: 'none' }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<NotInterestedIcon />}
                            onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS?.REJECTED, notification?._id)}
                            sx={{ borderRadius: 1, textTransform: 'none' }}
                          >
                            Decline
                          </Button>
                        </Box>
                      )}
                      {notification?.boardInvitation?.status === BOARD_INVITATION_STATUS?.ACCEPTED && (
                        <Chip
                          icon={<DoneIcon />}
                          label="Accepted"
                          color="success"
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      )}
                      {notification?.boardInvitation?.status === BOARD_INVITATION_STATUS?.REJECTED && (
                        <Chip
                          icon={<NotInterestedIcon />}
                          label="Declined"
                          color="error"
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </NotificationItem>
            ))}
        </Box>

        {currentNotification && currentNotification.length > 0 && (
          <Box sx={{ p: 2, borderTop: `1px solid ${(theme) => theme.palette.divider}` }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DeleteSweepIcon />}
              onClick={handleDeleteAll}
              sx={{
                borderRadius: 1,
                textTransform: 'none',
                color: 'text.secondary',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              Clear all notifications
            </Button>
          </Box>
        )}
      </StyledMenu>
    </Box>
  )
}

export default Notifications
