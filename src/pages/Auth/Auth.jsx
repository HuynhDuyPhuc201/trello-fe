import { Navigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useUser } from '~/redux/user/userSlice'
import { path } from '~/config/path'

function Auth() {
  const { pathname } = useLocation()
  const isLogin = pathname === '/login' || pathname === '/'
  const isRegister = pathname === '/register'

  const { currentUser } = useUser()

  if (currentUser) {
    return <Navigate to={path.Board.index} />
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'url("src/assets/auth/login-register-bg.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.2)'
      }}
    >
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
    </Box>
  )
}

export default Auth
