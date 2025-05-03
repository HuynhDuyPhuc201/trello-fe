import { useRoutes } from 'react-router-dom'
import routers from './router'
import { Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'

function App() {
  const element = useRoutes(routers)

  return (
    <>
      <Suspense
        fallback={
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
            <CircularProgress color="secondary" />
          </Box>
        }
      >
        {element}
      </Suspense>
    </>
  )
}

export default App
