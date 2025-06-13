import { lazy } from 'react'
import BoardList from './pages/Boards'
import { path } from './config/path'
import Board from './pages/Boards/_id'
import withAuth from './components/withAuth'
const AccountVerification = lazy(() => import('./pages/Auth/AccountVerification'))
const Auth = lazy(() => import('./pages/Auth/Auth'))
const Settings = lazy(() => import('./pages/Settings/Settings'))
const NotFoundPage = lazy(() => import('./pages/NotFound/NotFoundPage'))

const ProtectedBoard = withAuth(Board)
const ProtectedSettings = withAuth(Settings)

const routers = [
  {
    path: path.Home,
    element: <Auth />
  },
  {
    path: path.Board.index,
    element: <BoardList />
  },
  {
    path: path.Board.detail,
    element: <ProtectedBoard />
  },
  {
    path: path.Login,
    element: <Auth />
  },
  {
    path: path.Register,
    element: <Auth />
  },
  {
    path: path.Settings.Account,
    element: <ProtectedSettings />
  },
  {
    path: path.Settings.Security,
    element: <ProtectedSettings />
  },
  {
    path: path.Verify,
    element: <AccountVerification />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]

export default routers
