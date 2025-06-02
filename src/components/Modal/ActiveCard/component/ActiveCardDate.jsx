import { Box, Typography, Chip, Paper } from '@mui/material'
import { CalendarToday } from '@mui/icons-material'
import dayjs from 'dayjs'
import { useActiveCard } from '~/redux/activeCard/activeCardSlice'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined'
import TitleActiveCard from './TitleActiveCard'

const ActiveCardDate = () => {
  const { currentActiveCard } = useActiveCard()

  const { startDate, endDate, endTime, reminder } = currentActiveCard?.date || {}

  const formatDate = (date) => dayjs(date).format('DD/MM/YYYY')
  const formatTime = (date) => dayjs(date).format('HH:mm')

  const getEndDateTime = () => {
    if (endTime) return dayjs(endTime)
    if (endDate) return dayjs(endDate)
    return null
  }

  const endDateTime = getEndDateTime()
  const isOverdue = endDateTime && dayjs().isAfter(endDateTime)
  const isDueSoon = endDateTime && dayjs().add(1, 'day').isAfter(endDateTime) && !isOverdue
  const reminders = [
    { label: '🔔 About 1 hour left!', timeBefore: 60, key: '60minutest' },
    { label: '🔔 About 30 minutes left!', timeBefore: 30, key: '30minutest' },
    { label: '🔔 About 31 minutes left!', timeBefore: 10, key: '10minutest' }
  ]

  const reminderObj = reminders?.find((item) => item.key === reminder)
  const [hasReminded, setHasReminded] = useState(false)

  useEffect(() => {
    if (!endDateTime || hasReminded) return

    const now = dayjs()
    const diffInMinutes = dayjs(endDateTime).diff(now, 'minute')

    // TH1: Đã quá hạn
    if (diffInMinutes <= 0) {
      toast.warning(`⏰ Card has expired`)
      setHasReminded(true)
      return
    }

    // TH2: Gần hết hạn trong khoảng reminder
    if (diffInMinutes <= reminderObj.timeBefore) {
      toast.info(`⏰ ${reminderObj.label}`)
      setHasReminded(true)
    }
  }, [endDateTime, reminderObj, hasReminded])

  if (!startDate && !endDate) return null

  const renderDateCard = (label, date, colorDot, time, statusColor, statusLabel, isEnd) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: statusColor ? `1px solid ${statusColor}` : '1px solid #dfe1e6',
        borderRadius: '8px',
        background: statusColor
          ? `linear-gradient(135deg, ${statusColor}22 0%, #ffffff 100%)`
          : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: statusColor || '#579dff',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: colorDot,
            flexShrink: 0
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#6b778c',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '11px'
            }}
          >
            {label}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <CalendarToday sx={{ fontSize: 16, color: '#6b778c' }} />
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: isEnd && isOverdue ? '#d32f2f' : isEnd && isDueSoon ? '#f57c00' : '#172b4d',
                fontSize: '15px'
              }}
            >
              {formatDate(date)}
            </Typography>
            {time && (
              <Chip
                label={formatTime(time)}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '11px',
                  fontWeight: 500,
                  bgcolor: '#e3f2fd',
                  color: '#1565c0',
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            )}
            {statusLabel && (
              <Chip
                label={statusLabel}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '10px',
                  fontWeight: 600,
                  bgcolor: statusColor,
                  color: 'white',
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  )

  return (
    <Box sx={{ mb: 3 }}>
      <TitleActiveCard icon={<AccessAlarmOutlinedIcon />} text="Dates" />

      <Box sx={{ display: 'flex', gap: 2, width: '100%', paddingLeft: 5, mt: 1.5 }}>
        {startDate && renderDateCard('Start Date', startDate, '#22c55e', startDate)}

        {endDate &&
          renderDateCard(
            'End Date',
            endDate,
            isOverdue ? '#f44336' : isDueSoon ? '#ff9800' : '#ef4444',
            endDateTime,
            isOverdue ? '#f44336' : isDueSoon ? '#ff9800' : undefined,
            isOverdue ? 'OVERDUE' : isDueSoon ? 'DUE SOON' : undefined,
            true
          )}
      </Box>
    </Box>
  )
}

export default ActiveCardDate
