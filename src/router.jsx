import { lazy } from 'react'
import BoardList from './pages/Boards'
import { path } from './config/path'
import Board from './pages/Boards/_id'
const Home = lazy(() => import('./pages/Home'))
const Auth = lazy(() => import('./pages/Auth/Auth'))
const NotFoundPage = lazy(() => import('./pages/NotFound/NotFoundPage'))

// admin

const routers = [
  {
    path: path.Home,
    element: <Home />
  },
  {
    path: path.Board.index,
    element: <BoardList />
  },
  {
    path: path.Board.detail,
    element: <Board />
  },
  {
    path: path.Login,
    element: <Auth />
  },{
    path: path.Register,
    element: <Auth />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]

export default routers
