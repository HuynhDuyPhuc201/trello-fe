import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { IconButton, InputAdornment, Card as MuiCard } from '@mui/material'
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
      const user = await userService.register(rest)
      if (user) {
        navigate(`/login?verifiedEmail=${user.email}`)
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Registration failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(submitRegister)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard
          sx={{
            minWidth: 380,
            maxWidth: 420,
            mx: 'auto',
            mt: 10,
            px: 3,
            py: 4,
            borderRadius: 3,
            boxShadow: 3
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <LockIcon />
            </Avatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <TrelloIcon />
            </Avatar>
          </Box>

          <Box textAlign="center" mt={1} color="text.secondary">
            Author: DuyPhucDev
          </Box>

          <Box mt={3}>
            <TextField
              autoFocus
              fullWidth
              label="Enter Email..."
              variant="outlined"
              error={!!errors.email}
              {...register('email', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName="email" />
          </Box>

          <Box mt={2} position="relative">
            <TextField
              fullWidth
              label="Enter Password..."
              type={showPass ? 'text' : 'password'}
              variant="outlined"
              autoComplete="new-password"
              error={!!errors.password}
              {...register('password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE }
              })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                      {showPass ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <FieldErrorAlert errors={errors} fieldName="password" />
          </Box>

          <Box mt={2}>
            <TextField
              fullWidth
              label="Confirm Password..."
              type={showPassConfirm ? 'text' : 'password'}
              variant="outlined"
              error={!!errors.password_confirmation}
              {...register('password_confirmation', {
                validate: (value) => value === watch('password') || PASSWORD_CONFIRMATION_MESSAGE
              })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassConfirm(!showPassConfirm)} edge="end" size="small">
                      {showPassConfirm ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <FieldErrorAlert errors={errors} fieldName="password_confirmation" />
          </Box>

          <CardActions sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
              Register
            </Button>
          </CardActions>

          <Box mt={2} textAlign="center">
            <Typography variant="body2">Already have an account?</Typography>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: 'primary.main',
                  fontWeight: 500,
                  '&:hover': { color: '#ffbb39' }
                }}
              >
                Log in!
              </Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default RegisterForm
