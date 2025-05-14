import { useRoutes } from 'react-router-dom'
import routers from './router'
import { Suspense } from 'react'
import LoadingSpiner from './components/Loading/Loading'

function App() {
  const element = useRoutes(routers)

  return (
    <>
      <Suspense fallback={<LoadingSpiner />}>{element}</Suspense>
    </>
  )
}

export default App
