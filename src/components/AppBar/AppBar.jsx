import Box from '@mui/material/Box'
import ModeSelect from '../ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as trelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { path } from '~/config/path'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'

function AppBar({ colorConfigs }) {
  const [searchValue, setSearchValue] = useState()

  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        borderBottom: (theme) =>
          `1px solid ${colorConfigs?.text ? colorConfigs?.text : theme.palette.mode === 'dark' ? '#fff' : '#000'}`,
        bgcolor: (theme) =>
          colorConfigs?.headerBg ? colorConfigs?.headerBg : theme.palette.mode === 'dark' ? '#000' : '#e6f0ff',
        '&::-webkit-scrollbar-track': {
          m: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to={path.Board.index}>
          <Tooltip title="Boards List">
            <AppsIcon
              sx={{
                fontSize: '2rem',
                color: (theme) =>
                  colorConfigs?.text ? colorConfigs?.text : theme.palette.mode === 'dark' ? '#fff' : '#000',
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
                color: (theme) =>
                  colorConfigs?.text ? colorConfigs?.text : theme.palette.mode === 'dark' ? '#fff' : '#000'
              }}
            />
            <Typography
              variant="span"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: (theme) =>
                  colorConfigs?.text ? colorConfigs?.text : theme.palette.mode === 'dark' ? '#fff' : '#000'
              }}
            >
              Trello
            </Typography>
          </Box>
        </Link>
        {/* responsive */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Templates colorConfigs={colorConfigs} />
          <Button
            startIcon={<LibraryAddIcon />}
            sx={{
              color: (theme) =>
                colorConfigs?.text ? colorConfigs?.text : theme.palette.mode === 'dark' ? '#fff' : '#000'
            }}
          >
            Create
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AutoCompleteSearchBoard colorConfigs={colorConfigs}/>
        <ModeSelect colorConfigs={colorConfigs} />

        {/* Notifications */}
        <Notifications colorConfigs={colorConfigs}/>

        <Tooltip title="HelpOutlineIcon">
          <HelpOutlineIcon
            sx={{
              cursor: 'pointer',
              color: (theme) =>
                colorConfigs?.text ? colorConfigs?.text : theme.palette.mode === 'dark' ? '#fff' : '#000'
            }}
          />
        </Tooltip>

        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
