import { Box, Typography } from '@mui/material'

const TitleActiveCard = ({ icon, text }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {icon}
      <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>
        {text}
      </Typography>
    </Box>
  )
}

export default TitleActiveCard
