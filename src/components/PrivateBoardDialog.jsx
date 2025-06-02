import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material'
import { useUser } from '~/redux/user/userSlice'
import { imageAvatar } from '~/config/constants'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { Link } from 'react-router-dom'

const PrivateBoardDialog = ({ open, onClose, onRequestAccess, user, openSendit }) => {
  const { currentUser } = useUser()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent style={{ textAlign: 'center', padding: '32px 24px' }}>
        <AdminPanelSettingsIcon fontSize="large" />

        <Typography variant="h6" style={{ fontWeight: 600 }}>
          {openSendit ? 'Request sent' : 'This board is private'}
        </Typography>

        {!openSendit && (
          <>
            <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
              Submit a request to this board administrator for access. If you are approved to join, you will receive an
              email.
            </Typography>

            <Box mt={3} display="flex" alignItems="center" justifyContent="start" gap={2}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt={currentUser.displayName} src={imageAvatar(currentUser)} sx={{ width: 40, height: 40 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={currentUser?.displayName}
                  secondary={`${currentUser?.email} • ${currentUser?.role}`}
                />
              </ListItem>
            </Box>

            <Divider style={{ margin: '24px 0' }} />

            <Button variant="contained" color="primary" fullWidth onClick={onRequestAccess}>
              Send request
            </Button>
          </>
        )}

        <Typography variant="body2" color="textSecondary" style={{ marginTop: 8, marginBottom: 10 }}>
          {openSendit && 'You will receive an Email if approved.'}
        </Typography>
        {openSendit && (
          <Box component={Link} to={'/'} mt={3} sx={{ marginTop: '20px' }}>
            <Button variant="contained" color="primary" fullWidth>
              Back
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PrivateBoardDialog
