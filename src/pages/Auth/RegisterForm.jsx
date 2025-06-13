import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import {
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useForm } from 'react-hook-form'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useState } from 'react'
import { userService } from '~/services/user.service'
import { toast } from 'react-toastify'

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [showPassConfirm, setShowPassConfirm] = useState(false)

  const submitRegister = async (data) => {
    const { password_confirmation, ...rest } = data
    try {
      const user = userService.register(rest)
      console.log('user', user)
      if (user) {
        navigate(`/login?verifiedEmail=${user.email}`)
      }
    } catch (error) {
      console.log('error', error)
    }
    // toast
    //   .promise(userService.register(rest), { pending: 'Register is in progress' })
    //   .then((user) => navigate(`/login?verifiedEmail=${user.email}`))
  }
  return (
    <form onSubmit={handleSubmit(submitRegister)}>
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
            <Box sx={{ marginTop: '1em', position: 'relative' }}>
              <TextField
                fullWidth
                label="Enter Password..."
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                variant="outlined"
                error={!!errors.password}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE }
                })}
              />
              {
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: '1em',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                </Box>
              }
              <FieldErrorAlert errors={errors} fieldName={'password'} />
            </Box>
            <Box sx={{ marginTop: '1em', position: 'relative' }}>
              <TextField
                fullWidth
                label="Enter Password Confirmation..."
                type={showPassConfirm ? 'text' : 'password'}
                variant="outlined"
                error={!!errors.password_confirmation}
                {...register('password_confirmation', {
                  validate: (value) => value === watch('password') || PASSWORD_CONFIRMATION_MESSAGE
                })}
              />
              {
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: '1em',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowPassConfirm(!showPassConfirm)}
                >
                  {showPassConfirm ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                </Box>
              }
              <FieldErrorAlert errors={errors} fieldName={'password_confirmation'} />
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
              Register
            </Button>
          </CardActions>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography>Already have an account?</Typography>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Log in!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default RegisterForm
