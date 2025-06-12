import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateBoard, useActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { Box, Chip, IconButton, TextField, Tooltip } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import BoardTypePopover from '~/components/BoardBar/BoardTypePopover'
import RenderColor from '~/components/renderColor'
import MenuIcon from '@mui/icons-material/Menu' // Nếu chưa import
import { useUser } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'
import socket from '~/sockets'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ setSidebarOpen, sidebarOpen }) {
  const dispatch = useDispatch()
  const [openInput, setOpenInput] = useState(false)
  const { currentActiveBoard } = useActiveBoard()
  const board = currentActiveBoard
  const valueRename = useRef(board?.title)
  const { currentUser } = useUser()

  const { findColor } = RenderColor()

  const handleSubmit = async () => {
    const newTitle = valueRename.current?.trim()

    if (newTitle && newTitle !== board?.title && board.ownerIds[0] === currentUser._id) {
      await dispatch(updateBoard({ boardId: board._id, title: newTitle })).unwrap()
      socket.emit('update_board', board._id)
    } else {
      toast.warning("You can't change")
    }
    setOpenInput(false)
  }

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      await handleSubmit()
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        paddingLeft: {
          xs: 0,
          sm: '280px'
        },
        overflowX: 'auto',
        bgcolor: (theme) =>
          findColor?.boardBarBg ? findColor?.boardBarBg : theme.palette.mode === 'dark' ? '#34495e' : '#001f4d',
        '&::-webkit-scrollbar': {
          height: '4px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
          height: '2px'
        }
      }}
    >
      {/* ===== Left side ===== */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{
            display: {
              xs: 'inline-flex',
              sm: 'none'
            },
            color: 'white'
          }}
        >
          <MenuIcon size="large" />
        </IconButton>

        <Tooltip title={board?.title}>
          {openInput ? (
            <TextField
              autoFocus
              defaultValue={board?.title}
              size="small"
              onKeyDown={handleKeyDown}
              onBlur={handleSubmit}
              onChange={(e) => (valueRename.current = e.target.value)}
              sx={{
                color: '#fff',
                width: '60%',
                '& .MuiInputBase-root': {
                  borderColor: '#fff'
                },
                '& .MuiITextField-root': {
                  color: '#fff'
                },
                '& .MuiInputBase-input': {
                  color: '#fff'
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                  '& fieldset': {
                    borderColor: 'white',
                    color: '#fff'
                  }
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white'
                }
              }}
            />
          ) : (
            <Chip sx={MENU_STYLES} icon={<DashboardIcon />} label={board?.title} onClick={() => setOpenInput(true)} />
          )}
        </Tooltip>

        <BoardTypePopover
          board={board}
          onUpdateType={(newType) => {
            dispatch(updateBoard({ boardId: board._id, type: newType }))
          }}
        />
      </Box>

      {/* ===== Right side ===== */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InviteBoardUser board={board} />
        <BoardUserGroup boardUsers={board?.allUsers} />
      </Box>
    </Box>
  )
}

export default BoardBar
