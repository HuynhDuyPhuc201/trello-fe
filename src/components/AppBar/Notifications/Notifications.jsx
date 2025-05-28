import { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import {
  addNotification,
  clearNotification,
  getInvite,
  updateInvite,
  useNotification
} from '~/redux/notifications/notificationsSlice'
import { useDispatch } from 'react-redux'
import { BOARD_INVITATION_STATUS } from '~/config/constants'
import { useUser } from '~/redux/user/userSlice'
import { getBoardAll } from '~/redux/activeBoard/activeBoardSlice'
import { inviteService } from '~/services/invite.service'
import { toast } from 'react-toastify'
import { path } from '~/config/path'
import { useNavigate } from 'react-router-dom'
import socket from '~/sockets'

function Notifications({ colorConfigs }) {
  const dispatch = useDispatch()

  const { currentNotification } = useNotification()
  const { currentUser } = useUser()
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteAll = async () => {
    try {
      const result = await inviteService.deletInvite(currentUser._id)
      if (result.success) {
        dispatch(getInvite()) // gọi lại getInvite để cập nhật danh sách thông báo
        dispatch(clearNotification())
      }
      // handleClose()
    } catch (error) {
      toast.error('Failed to delete all board. Please try again.', error)
    }
  }

  useEffect(() => {
    dispatch(getInvite())
    if (!currentUser._id) return

    const handler = (Invitation) => {
      if (Invitation.inviteeId === currentUser._id) {
        dispatch(addNotification(Invitation))
      }
    }
    socket.on('invite_to_board', handler)
    return () => {
      socket.off('invite_to_board', handler)
    }
  }, [currentUser._id, dispatch])

  const navigation = useNavigate()
  const updateBoardInvitation = async (status, invitationId) => {
    try {
      const updatedInvite = await dispatch(updateInvite({ status, invitationId })).unwrap()
      await dispatch(getInvite()) // <-- refresh lại danh sách thông báo
      await dispatch(getBoardAll())
      // check status sau khi update, nếu accept -> derect sang board đó
      const checkStatus = updatedInvite.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED
      if (checkStatus) {
        const boardId = updatedInvite?.boardInvitation.boardId
        if (!boardId || !currentUser) return
        // lấy realtime để check hiển thị member khi user vào board
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
      // toast.error('Failed to update board invite. Please try again.', error)
    }
  }

  useEffect(() => {}, [currentNotification, dispatch])
  const notificationOfInvitee =
    (currentNotification &&
      currentNotification?.filter(
        (invite) => invite.inviteeId === currentUser._id || invite?.invitee?._id === currentUser._id
      )) ||
    []

  const unreadCount = notificationOfInvitee.filter(
    (n) => n.boardInvitation.status === BOARD_INVITATION_STATUS.PENDING
  ).length

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          badgeContent={unreadCount}
          invisible={unreadCount === 0}
          // variant={notification ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon
            sx={{
              color: (theme) =>
                colorConfigs?.text ? colorConfigs?.text : theme.palette.mode === 'dark' ? '#fff' : '#000'
            }}
          />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {(!notificationOfInvitee || notificationOfInvitee.length === 0) && (
          <MenuItem sx={{ minWidth: 200 }}>You do not have any new notifications.</MenuItem>
        )}
        {notificationOfInvitee &&
          notificationOfInvitee?.map((nofitication, index) => (
            <Box key={index}>
              <MenuItem
                sx={{
                  minWidth: 200,
                  maxWidth: 360,
                  overflowY: 'auto'
                }}
              >
                <Box
                  sx={{
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  {/* Nội dung của thông báo */}
                  <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                    <Box>
                      <GroupAddIcon fontSize="small" />
                    </Box>
                    <Box>
                      {nofitication?.boardInvitation?.status === BOARD_INVITATION_STATUS?.PENDING ? (
                        <>
                          <strong>{nofitication?.inviter?.displayName} </strong>had invited you to join the board{' '}
                          <strong>{nofitication?.board?.title}</strong>
                        </>
                      ) : nofitication?.boardInvitation?.status === BOARD_INVITATION_STATUS?.ACCEPTED ? (
                        <>
                          You have accepted the invitation <strong>{nofitication?.board?.title}</strong>
                        </>
                      ) : (
                        <>
                          You have rejected the invitation <strong>{nofitication?.board?.title}</strong>
                        </>
                      )}
                    </Box>
                  </Box>

                  {/* Khi Status của thông báo này là PENDING thì sẽ hiện 2 Button */}

                  {nofitication?.boardInvitation?.status === BOARD_INVITATION_STATUS?.PENDING && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        className="interceptor-loading"
                        type="submit"
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS?.ACCEPTED, nofitication?._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        className="interceptor-loading"
                        type="submit"
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS?.REJECTED, nofitication?._id)}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}

                  {/* Khi Status của thông báo này là ACCEPTED hoặc REJECTED thì sẽ hiện thông tin đó lên */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                    {nofitication?.boardInvitation?.status === BOARD_INVITATION_STATUS?.ACCEPTED && (
                      <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />
                    )}
                    {nofitication?.boardInvitation?.status === BOARD_INVITATION_STATUS?.REJECTED && (
                      <Chip icon={<NotInterestedIcon />} label="Rejected" size="small" />
                    )}
                  </Box>

                  {/* Thời gian của thông báo */}
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="span" sx={{ fontSize: '13px' }}>
                      {moment(nofitication.createdAt).format('llll')}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              {/* Cái đường kẻ Divider sẽ không cho hiện nếu là phần tử cuối */}
              {index !== notificationOfInvitee?.length - 1 && <Divider />}
            </Box>
          ))}

        {notificationOfInvitee && notificationOfInvitee.length > 0 && (
          <Box
            sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'end' }}
            onClick={handleDeleteAll}
          >
            {<Button>Delete all</Button>}
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default Notifications
