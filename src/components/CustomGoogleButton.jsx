import { useGoogleLogin } from '@react-oauth/google'
import Button from '@mui/material/Button'
import GoogleIcon from '@mui/icons-material/Google'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { loginGoogle } from '~/redux/user/userSlice'
import { setToken } from '~/config/token'
import { path } from '~/config/path'

export const CustomGoogleButton = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLoginGoogle = useGoogleLogin({
    onSuccess: async (res) => {
      const { code } = res
      try {
        const res = await dispatch(loginGoogle({ token: code })).unwrap()
        if (res.token) setToken(res.token)
        if (res) navigate(path.Board.index)
      } catch (error) {
        toast.error(error)
      }
    },
    onError: () => {
      console.error('Login Failed')
    },
    flow: 'auth-code'
  })
  return (
    <Button
      onClick={() => handleLoginGoogle()}
      fullWidth
      variant="outlined"
      startIcon={<GoogleIcon />}
      sx={{
        textTransform: 'none',
        fontWeight: 'bold',
        color: '#555',
        borderColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: '#f1f1f1',
          borderColor: '#ccc'
        }
      }}
    >
      Sign in with Google
    </Button>
  )
}
