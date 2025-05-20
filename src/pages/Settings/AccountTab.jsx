import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import MailIcon from '@mui/icons-material/Mail'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'

import { FIELD_REQUIRED_MESSAGE, singleFileValidator } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { updateUserAPI, useUser } from '~/redux/user/userSlice'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'

// Xử lý custom đẹp cái input file ở đây: https://mui.com/material-ui/react-button/#file-upload
// Ngoài ra note thêm lib này từ docs của MUI nó recommend nếu cần dùng: https://github.com/viclafouch/mui-file-input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

function AccountTab() {
  const { currentUser } = useUser()
  const dispatch = useDispatch()

  // Những thông tin của user để init vào form (key tương ứng với register phía dưới Field)
  const initialGeneralForm = {
    displayName: currentUser?.displayName
  }
  // Sử dụng defaultValues để set giá trị mặc định cho các field cần thiết
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: initialGeneralForm
  })

  const submitChangeGeneralInformation = (form) => {
    const { displayName } = form
    // Nếu không có sự thay đổi gì về displayname thì không làm gì cả
    if (displayName === currentUser?.displayName) return
    dispatch(updateUserAPI(form))
  }

  const uploadAvatar = (e) => {
    const file = e.target?.files?.[0]
    const error = singleFileValidator(file)
    if (error) {
      toast.error(error)
      return
    }

    const formData = new FormData()
    formData.append('avatar', file) // 👈 key phải trùng với backend

    // // Kiểm tra kỹ giá trị trong FormData
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value) // 👈 phải in ra kiểu File, không phải {}
    // }

    dispatch(updateUserAPI(formData))
    e.target.value = ''
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Avatar sx={{ width: 84, height: 84, mb: 1 }} alt="TrungQuanDev" src={currentUser?.avatar} />
            <Tooltip title="Upload a new image to update your avatar immediately.">
              <Button component="label" variant="contained" size="small" startIcon={<CloudUploadIcon />}>
                Upload
                <VisuallyHiddenInput type="file" onChange={uploadAvatar} />
              </Button>
            </Tooltip>
          </Box>
          <Box>
            <Typography variant="h6">{currentUser?.displayName}</Typography>
            <Typography sx={{ color: 'grey' }}>@{currentUser?.username}</Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(submitChangeGeneralInformation)}>
          <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.email}
                fullWidth
                label="Your Email"
                type="text"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.username}
                fullWidth
                label="Your Username"
                type="text"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Your Display Name"
                type="text"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentIndIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register('displayName', {
                  required: FIELD_REQUIRED_MESSAGE
                })}
                error={!!errors['displayName']}
              />
              <FieldErrorAlert errors={errors} fieldName={'displayName'} />
            </Box>

            <Box>
              <Button className="interceptor-loading" type="submit" variant="contained" color="primary" fullWidth>
                Update
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default AccountTab
