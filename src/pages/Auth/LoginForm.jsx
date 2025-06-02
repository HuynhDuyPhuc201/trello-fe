import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { Alert, Card as MuiCard } from '@mui/material'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import CardActions from '@mui/material/CardActions'
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
      if (res) navigate(path.Board.index)
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
          <Box
            sx={{
              margin: '1em',
              display: 'flex',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <LockIcon />
            </Avatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <TrelloIcon />
            </Avatar>
          </Box>
          <Box
            sx={{
              marginTop: '1em',
              display: 'flex',
              justifyContent: 'center',
              color: (theme) => theme.palette.grey[500]
            }}
          >
            Author: DuyPhucDev
          </Box>
          <Box
            sx={{
              marginTop: '1em',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 1em'
            }}
          >
            {registerEmail && (
              <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                Your email&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>
                  {registerEmail}
                </Typography>
                &nbsp;has been verified.
                <br />
                Now you can login to enjoy our services! Have a good day!
              </Alert>
            )}
            {verifiedEmail && (
              <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                An email has been sent to&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>
                  hdphuc201@gmail.com
                </Typography>
                <br />
                Please check and verify your account before logging in!
              </Alert>
            )}
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                variant="outlined"
                error={!!errors.email}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'} />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter Password..."
                type="password"
                variant="outlined"
                error={!!errors.password}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'password'} />
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
              Login
            </Button>
          </CardActions>

          <Box
            sx={{
              // mt: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 3,
              padding: '0 1em 1em 1em',
              width: '100%'
            }}
          >
            <GoogleOAuthProvider clientId="864578907923-1d5tlb21b4j69p82t3cmciq4h45b2g42.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleLoginGoogle}
                onError={() => console.log('Login Failed')}
                theme="outline"
                size="large"
                cookiePolicy="single_host_origin"
              />
            </GoogleOAuthProvider>
          </Box>

          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography>New to Trello?</Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Create account!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default LoginForm
