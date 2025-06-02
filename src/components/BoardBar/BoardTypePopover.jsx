import { useState } from 'react'
import { Chip, Popover, Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import VpnLockIcon from '@mui/icons-material/VpnLock'

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
const typeOptions = [
  {
    value: 'private',
    label: 'Private',
    description: 'Only board members can see this board.',
    icon: <LockIcon color="error" />
  },
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone on the internet can see this board.',
    icon: <PublicIcon color="primary" />
  }
]

function BoardTypePopover({ board, onUpdateType }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'board-type-popover' : undefined

  const handleSelectType = (type) => {
    onUpdateType(type)
    handleClose()
  }

  const labelType = board?.type.charAt(0).toUpperCase() + board?.type.slice(1)
  return (
    <>
      <Chip sx={MENU_STYLES} icon={<VpnLockIcon />} label={labelType} clickable onClick={handleOpen} />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="subtitle1" gutterBottom textAlign={'center'}>
            Board Visibility
          </Typography>
          <List>
            {typeOptions.map((option) => (
              <ListItem
                button
                key={option.value}
                onClick={() => handleSelectType(option.value)}
                selected={board?.type === option.value}
              >
                <ListItemIcon>{option.icon}</ListItemIcon>
                <ListItemText primary={option.label} secondary={option.description} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  )
}

export default BoardTypePopover
