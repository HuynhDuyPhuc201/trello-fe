import { useColorScheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import Box from '@mui/material/Box'
import RenderColor from '../renderColor'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const { findColor } = RenderColor()
  const handleChange = (event) => {
    setMode(event.target.value)
  }
  return (
    <FormControl size="small" sx={{ minWidth: '120px' }}>
      <InputLabel
        id="label-select-dark-light-mode"
        sx={{
          color: (theme) => (findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'),
          '&.Mui-focused': {
            color: (theme) => (findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c')
          }
        }}
      >
        Mode
      </InputLabel>
      <Select
        name="mode"
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
        sx={{
          color: (theme) => (findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'),
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: (theme) =>
              findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: (theme) =>
              findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: (theme) =>
              findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'
          },
          '.MuiSvgIcon-root': {
            color: (theme) =>
              findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'
          }
        }}
      >
        <MenuItem value="light">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightModeIcon fontSize="small" />
            Light
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DarkModeIcon fontSize="small" />
            Dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsBrightnessIcon fontSize="small" />
            System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default ModeSelect
