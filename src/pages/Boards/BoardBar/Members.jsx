import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { Scrollbar } from 'react-scrollbars-custom'
import { imageAvatar } from '~/config/constants'

function Members({ board }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const isOpen = Boolean(anchorEl)
  const popoverId = isOpen ? 'members-popover' : undefined

  const handleTogglePopover = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  return (
    <Box>
      <Tooltip title="View members of this board">
        <Button
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          variant="outlined"
          startIcon={<PeopleAltIcon />}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
        >
          Members
        </Button>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 300,
            maxHeight: 400,
            borderRadius: 2,
            p: 2
          }
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Board Members
        </Typography>
        <Divider sx={{ mb: 1 }} />

        {/* Scrollable Member List */}
        <Scrollbar style={{ height: 300 }}>
          {board?.allUsers?.length ? (
            board.allUsers.map((member) => (
              <Box
                key={member._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <Avatar
                  alt={member.name}
                  src={imageAvatar(member)}
                  sx={{ width: 32, height: 32 }}
                />
                <Box>
                  <Typography variant="body1">{member.displayName || 'No Name'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.email}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No members found.
            </Typography>
          )}
        </Scrollbar>
      </Popover>
    </Box>
  )
}

export default Members
