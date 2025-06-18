import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { Alert, Card as MuiCard } from '@mui/material'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import { useForm } from 'react-hook-form'
import {
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useDispatch } from 'react-redux'
import { loginGoogle, loginUserAPI } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'
import { path } from '~/config/path'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { setToken } from '~/config/token'

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const verifiedEmail = searchParams?.get('verifiedEmail') || null
  const registerEmail = searchParams?.get('registerEmail') || null

  const submitLogIn = async (data) => {
    try {
      const res = await dispatch(loginUserAPI(data)).unwrap()
      if (res.token) {
        setToken(res.token)
      }

      if (res) navigate(path.Board.index)
    } catch (error) {
      toast.error(error)
    }
  }

  //google
  const handleLoginGoogle = async (credentialResponse) => {
    const token = credentialResponse.credential
    try {
      const res = await dispatch(loginGoogle({ token })).unwrap()
      if (res.token) {
        setToken(res.token)
      }

      if (res) navigate(path.Board.index)
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard
          sx={{
            minWidth: 400,
            maxWidth: 400,
            mx: 'auto',
            mt: 10,
            borderRadius: 3,
            boxShadow: 6,
            p: 3
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <LockIcon />
            </Avatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <TrelloIcon />
            </Avatar>
          </Box>

          <Typography variant="h6" textAlign="center" color="text.secondary" mb={2}>
            Author: DuyPhucDev
          </Typography>

          {registerEmail && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your email&nbsp;
              <Typography component="span" fontWeight="bold" color="primary">
                {registerEmail}
              </Typography>
              &nbsp;has been verified.
              <br />
              Now you can login to enjoy our services!
            </Alert>
          )}

          {verifiedEmail && (
            <Alert severity="info" sx={{ mb: 2 }}>
              An email has been sent to&nbsp;
              <Typography component="span" fontWeight="bold" color="primary">
                {verifiedEmail}
              </Typography>
              <br />
              Please check and verify your account.
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            autoFocus
            error={!!errors.email}
            {...register('email', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
            })}
          />
          <FieldErrorAlert errors={errors} fieldName="email" />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            margin="normal"
            autoComplete="current-password"
            error={!!errors.password}
            {...register('password', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE }
            })}
          />
          <FieldErrorAlert errors={errors} fieldName="password" />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Login
          </Button>

          <Box mt={2}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleLoginGoogle}
                onError={() => console.log('Login Failed')}
                theme="outline"
                size="large"
                width="100%"
              />
            </GoogleOAuthProvider>
          </Box>

          <Box mt={3} textAlign="center">
            <Typography variant="body2">New to Trello?</Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{ fontWeight: 'bold', mt: 1, '&:hover': { color: '#fdba26' } }}
              >
                Create an account!
              </Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default LoginForm
