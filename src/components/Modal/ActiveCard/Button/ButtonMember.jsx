import { useRef, useState } from 'react'
import {
  Box,
  Typography,
  Popover,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { SidebarItem } from '../SidebarItem'
import { useActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { imageAvatar } from '~/config/constants'
import { useActiveCard } from '~/redux/activeCard/activeCardSlice'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'

function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}
export default function ButtonMember() {
  const { currentActiveBoard } = useActiveBoard()
  const { currentActiveCard } = useActiveCard()
  const [openCoverPopover, setOpenCoverPopover] = useState(false)
  const memberButtonRef = useRef()
  const board = currentActiveBoard
  const cardMembers = board.allUsers.filter((user) => currentActiveCard?.memberIds?.includes(user._id))
  return (
    <>
      <SidebarItem
        ref={memberButtonRef}
        className="active"
        component="label"
        onClick={() => setOpenCoverPopover(!openCoverPopover)}
      >
        <GroupOutlinedIcon fontSize="small" />
        Member
      </SidebarItem>
      <Popover
        open={openCoverPopover}
        anchorEl={memberButtonRef?.current}
        onClose={() => setOpenCoverPopover(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        sx={{
          '& .MuiPaper-rounded': {
            width: '300px',
            padding: '8px',
            marginTop: '10px'
          }
        }}
      >
        {/* Header */}
        <Box position="relative" mb={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }} textAlign={'center'}>
            Members
          </Typography>
          <IconButton
            size="small"
            onClick={() => setOpenCoverPopover(false)}
            sx={{ position: 'absolute', top: 0, right: 0 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Title */}
        {/*  */}
        {cardMembers?.length > 0 && (
          <Box
            sx={{
              marginBottom: 2
            }}
          >
            <Typography fontSize={13} color="text.secondary" mb={1} pl={1}>
              Members of card
            </Typography>
            <List dense disablePadding>
              {cardMembers.map((member) => (
                <ListItem
                  key={member._id}
                  sx={{
                    borderRadius: 1,
                    '&:hover': { backgroundColor: '#f1f5f9', cursor: 'pointer' }
                  }}
                >
                  <ListItemAvatar>
                    {member.avatar ? (
                      <Avatar alt={member?.displayName} src={imageAvatar(member)} sx={{ width: 40, height: 40 }} />
                    ) : (
                      <Avatar sx={{ bgcolor: '#6B46C1' }}>{getInitials(member.name)}</Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText primary={member?.displayName} secondary={`${member?.email}`} />
                </ListItem>
              ))}
            </List>
            <Divider />
          </Box>
        )}

        <Typography fontSize={13} color="text.secondary" mb={1} pl={1}>
          Members of board
        </Typography>

        {/* Danh sách thành viên */}
        <List dense disablePadding>
          {board.allUsers?.map((member) => (
            <ListItem
              key={member._id}
              sx={{
                borderRadius: 1,
                '&:hover': { backgroundColor: '#f1f5f9', cursor: 'pointer' }
              }}
            >
              <ListItemAvatar>
                {member.avatar ? (
                  <Avatar alt={member?.displayName} src={imageAvatar(member)} sx={{ width: 40, height: 40 }} />
                ) : (
                  <Avatar sx={{ bgcolor: '#6B46C1' }}>{getInitials(member.name)}</Avatar>
                )}
              </ListItemAvatar>
              <ListItemText primary={member?.displayName} secondary={`${member?.email}`} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  )
}
