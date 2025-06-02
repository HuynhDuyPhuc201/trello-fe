import { useRef, useState } from 'react'
import {
  Popover,
  Box,
  Typography,
  IconButton,
  TextField,
  Checkbox,
  MenuItem,
  Select,
  Button,
  Divider
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import dayjs from 'dayjs'
import { SidebarItem } from '../SidebarItem'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import { useFetchUpdateCard } from '~/hooks/useFetchUpdateCard'

export default function ButtonDate() {
  const [startEnabled, setStartEnabled] = useState(false)
  const [endEnabled, setEndEnabled] = useState(true)
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs())
  const [selectedStartDate, setSelectedStartDate] = useState(dayjs())
  const [selectedTime, setSelectedTime] = useState(dayjs().format('HH:mm'))
  const [reminder, setReminder] = useState('10minutest')

  const [openDate, setOpenDate] = useState(false)
  const dataButtonRef = useRef()
  const { fetchUpdateCard } = useFetchUpdateCard()

  const handleSaveDate = async () => {
    let endTime = null

    if (selectedTime && selectedEndDate && endEnabled) {
      const [hours, minutes] = selectedTime.split(':').map(Number)
      endTime = dayjs(selectedEndDate).hour(hours).minute(minutes).second(0).millisecond(0).valueOf()
    }

    const updateDate = {
      startDate: selectedStartDate && startEnabled ? new Date(selectedStartDate).getTime() : null,
      endDate: selectedEndDate && endEnabled ? new Date(selectedEndDate).getTime() : '',
      endTime: endTime,
      reminder: reminder ? reminder : null
    }
    setOpenDate(false)
    return fetchUpdateCard({ date: updateDate })
  }
  const handleCancelDate = () => {
    setStartEnabled(false)
    setEndEnabled(false)
    const updateDate = {
      startDate: null,
      endDate: '',
      endTime: null,
      reminder: null
    }
    setOpenDate(false)
    return fetchUpdateCard({ date: updateDate })
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <SidebarItem ref={dataButtonRef} onClick={() => setOpenDate(!openDate)}>
        <WatchLaterOutlinedIcon fontSize="small" />
        Dates
      </SidebarItem>

      <Popover
        open={openDate}
        anchorEl={dataButtonRef?.current}
        onClose={() => setOpenDate(false)}
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
            width: '330px',
            padding: '8px',
            marginTop: '10px'
          }
        }}
      >
        <Box position="relative" mb={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }} textAlign={'center'}>
            Date
          </Typography>
          <IconButton size="small" onClick={() => setOpenDate(false)} sx={{ position: 'absolute', top: 0, right: 0 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Start date */}
        <Box mt={1}>
          <Typography fontSize={13} fontWeight={500} mb={0.5}>
            Start Date
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Checkbox checked={startEnabled} onChange={(e) => setStartEnabled(e.target.checked)} />
            <Box display="flex" gap={1}>
              <TextField
                disabled={!startEnabled}
                type="date"
                value={selectedStartDate.format('YYYY-MM-DD')}
                size="small"
                fullWidth
                onChange={(e) => setSelectedStartDate(dayjs(e.target.value))}
              />
            </Box>
          </Box>
        </Box>
        <Divider style={{ margin: '12px 0' }} />

        {/* End date */}
        <Box mt={2}>
          <Typography fontSize={13} fontWeight={500} mb={0.5}>
            End date
          </Typography>
          <Box display="flex" gap={1}>
            <Checkbox checked={endEnabled} onChange={(e) => setEndEnabled(e.target.checked)} />
            <TextField
              type="date"
              value={selectedEndDate.format('YYYY-MM-DD')}
              size="small"
              onChange={(e) => setSelectedEndDate(dayjs(e.target.value))}
            />
            <TextField
              type="time"
              value={selectedTime}
              size="small"
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </Box>
        </Box>

        {/* Reminder */}
        <Box mt={2}>
          <Typography fontSize={13} fontWeight={500} mb={0.5}>
            Remin setting
          </Typography>
          <Select size="small" fullWidth value={reminder} onChange={(e) => setReminder(e.target.value)}>
            <MenuItem value="10minutest">10 Minutes ago</MenuItem>
            <MenuItem value="30minutest">30 Minutes ago</MenuItem>
            <MenuItem value="60minutest">1 Hours ago</MenuItem>
          </Select>
        </Box>

        {/* Buttons */}
        <Box gap={1} mt={2}>
          <Button variant="contained" fullWidth onClick={handleSaveDate}>
            Save
          </Button>
          <Button variant="outlined" fullWidth onClick={handleCancelDate} sx={{ marginTop: 1 }}>
            Cancel
          </Button>
        </Box>
      </Popover>
    </Box>
  )
}
