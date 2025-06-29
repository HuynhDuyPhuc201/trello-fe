import Box from '@mui/material/Box'
import ModeSelect from '../ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as trelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import { Link } from 'react-router-dom'
import { path } from '~/config/path'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'
import RenderColor from '../renderColor'

function AppBar() {
  const { findColor } = RenderColor()

  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        borderBottom: (theme) =>
          `1px solid ${findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'}`,
        bgcolor: (theme) =>
          findColor?.headerBg ? findColor?.headerBg : theme.palette.mode === 'dark' ? '#1c1c1c' : '#e6f0ff',
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
        },
        [theme.breakpoints.down('sm')]: {
          height: '80px'
        },
        [theme.breakpoints.down('sm')]: {
          height: '80px'
        }
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to={path.Board.index}>
          <Tooltip title="Boards List">
            <AppsIcon
              sx={{
                fontSize: '2rem',
                color: (theme) => (findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'),
                verticalAlign: 'middle'
              }}
            />
          </Tooltip>
        </Link>
        <Link to={path.Home} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon
              component={trelloIcon}
              inheritViewBox
              sx={{
                color: (theme) => (findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c')
              }}
            />
            <Typography
              variant="span"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: (theme) => (findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c')
              }}
            >
              Trello
            </Typography>
          </Box>
        </Link>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AutoCompleteSearchBoard />
        <ModeSelect />

        <Notifications />

        <Tooltip title="HelpOutlineIcon">
          <HelpOutlineIcon
            sx={{
              cursor: 'pointer',
              color: (theme) => (findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c')
            }}
          />
        </Tooltip>

        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
