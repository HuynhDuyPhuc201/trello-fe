import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateBoard } from '~/redux/activeBoard/activeBoardSlice'
import { Box, Chip, TextField, Tooltip } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import BoardTypePopover from '~/components/BoardBar/BoardTypePopover'

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

function BoardBar({ board, colorConfigs }) {
  const valueRename = useRef(board?.title)
  const dispatch = useDispatch()
  const [openInput, setOpenInput] = useState(false)

  const handleSubmit = async () => {
    const newTitle = valueRename.current?.trim()
    if (newTitle && newTitle !== board?.title) {
      await dispatch(updateBoard({ boardId: board._id, title: newTitle }))
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
        overflowX: 'auto',
        bgcolor: (theme) =>
          colorConfigs?.boardBarBg ? colorConfigs?.boardBarBg : theme.palette.mode === 'dark' ? '#34495e' : '#001f4d',
        '&::-webkit-scrollbar-track': {
          m: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

        <Chip sx={MENU_STYLES} icon={<AddToDriveIcon />} label="Add To Google Drive" clickable />
        <Chip sx={MENU_STYLES} icon={<BoltIcon />} label="Automation" clickable />
        <Chip sx={MENU_STYLES} icon={<FilterListIcon />} label="Filters" clickable />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InviteBoardUser board={board} />
        <BoardUserGroup boardUsers={board?.allUsers} />
      </Box>
    </Box>
  )
}

export default BoardBar
