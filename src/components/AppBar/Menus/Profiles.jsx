import Menu from '@mui/material/Menu'
import { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

import ListItemIcon from '@mui/material/ListItemIcon'

import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import { logoutUserAPI, useUser } from '~/redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { useConfirm } from 'material-ui-confirm'
import { Link, useNavigate } from 'react-router-dom'
import { path } from '~/config/path'
import { imageAvatar } from '~/config/constants'
import { removeToken, removeUser } from '~/config/token'
import { clearCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

function Profiles() {
  const [anchorEl, setAnchorEl] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const { currentUser } = useUser()
  const confirmDeleteColumn = useConfirm()
  const handleLogout = async () => {
    try {
      await confirmDeleteColumn({
        title: 'Logout of your account?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      })
      removeToken()
      removeUser()
      await dispatch(logoutUserAPI()).unwrap()
      dispatch(clearCurrentActiveBoard())
      navigate(path.Home)
    } catch {
      // null
    }
  }

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt={currentUser?.displayName}
            src={imageAvatar(currentUser) || undefined}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}
      >
        <Link to={path.Settings.Account} style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem onClick={handleClose} sx={{ '&:hover': { color: 'success.light' } }}>
            <Avatar sx={{ width: 28, height: 28, mr: 2 }} src={imageAvatar(currentUser)} /> Profile
          </MenuItem>
        </Link>
        <Divider />
        <Link to={path.Settings.Account} style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        </Link>
        <MenuItem
          onClick={handleLogout}
          sx={{ '&:hover': { color: 'warning.dark', '& .logout-icon': { color: 'warning.dark' } } }}
        >
          <ListItemIcon>
            <Logout className="logout-icon" fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles
