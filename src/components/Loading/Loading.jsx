import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingSpiner = ({ caption }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography>{caption}</Typography>
    </Box>
  )
}

export default LoadingSpiner
