import {
  Box,
  Modal,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Button,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import AbcIcon from '@mui/icons-material/Abc'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { Controller, useForm } from 'react-hook-form'
import { generateColorConfigs } from '~/utils/getTextColor'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { BOARD_TYPES, unsplashSamples } from '~/config/constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { boardService } from '~/services/board.service'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { getBoardAll } from '~/redux/activeBoard/activeBoardSlice'
import { useNavigate } from 'react-router-dom'
import { path } from '~/config/path'

const CreateBoardModal = ({ isOpen, handleClose, directPage = false }) => {
  const renderColor = generateColorConfigs()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      type: BOARD_TYPES.PUBLIC,
      cover: ''
    }
  })
  const navigaton = useNavigate()
  const [cover, setCover] = useState('')
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const handleCloseModal = () => {
    handleClose()
    reset()
  }

  const createBoardMutation = useMutation({
    mutationFn: boardService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      dispatch(getBoardAll())
      handleCloseModal()
      if (directPage) {
        navigaton(path.Board.detail.replace(':boardId', data._id))
      }
    },
    onError: (error) => {
      console.error('Create board failed:', error)
    }
  })

  const submitCreateNewBoard = async (data) => {
    if (cover) data.cover = cover
    createBoardMutation.mutate(data)
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {
            xs: '95%',
            sm: '90%',
            md: 600
          },
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          padding: '20px 30px',
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : 'white')
        }}
      >
        <Box sx={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} onClick={handleCloseModal}>
          <CancelIcon width="30" color="success" sx={{ '&:hover': { color: '#808080' } }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LibraryAddIcon />
          <Typography variant="h6" component="h2">
            Create a new board
          </Typography>
        </Box>
        <Box sx={{ my: 2 }}>
          <form onSubmit={handleSubmit(submitCreateNewBoard)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Title"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AbcIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  {...register('title', {
                    required: FIELD_REQUIRED_MESSAGE,
                    minLength: { value: 3, message: 'Min Length is 3 characters' },
                    maxLength: { value: 50, message: 'Max Length is 50 characters' }
                  })}
                  error={!!errors['title']}
                />
                <FieldErrorAlert errors={errors} fieldName="title" />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  {...register('description', {
                    required: FIELD_REQUIRED_MESSAGE,
                    minLength: { value: 3, message: 'Min Length is 3 characters' },
                    maxLength: { value: 255, message: 'Max Length is 255 characters' }
                  })}
                  error={!!errors['description']}
                />
                <FieldErrorAlert errors={errors} fieldName="description" />
              </Box>

              <Box>
                <Typography sx={{ py: 1, fontSize: '12px' }}>Color</Typography>
                <Grid container spacing={1}>
                  {renderColor.map((color, index) => (
                    <Grid item key={index} xs={3} md={3}>
                      <Box
                        sx={{
                          height: '30px',
                          background: color.background,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          border: (theme) =>
                            cover === color.background
                              ? `2px solid ${theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'}`
                              : 'none'
                        }}
                        onClick={() => setCover(color.background)}
                      ></Box>
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ py: 1 }} />
                <Box>
                  <Typography sx={{ py: 1, fontSize: '12px' }}>Background</Typography>

                  {/* Grid ảnh Unsplash */}
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {unsplashSamples?.map((item, index) => (
                      <Grid item xs={6} md={4} key={index}>
                        <Box
                          component="img"
                          src={item}
                          onClick={() => setCover(item)}
                          sx={(theme) => ({
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.8
                            },
                            border:
                              cover === item ? `2px solid ${theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'}` : 'none'
                          })}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
              {/*
               * Lưu ý đối với RadioGroup của MUI thì không thể dùng register tương tự TextField được mà phải sử dụng <Controller /> và props "control" của react-hook-form như cách làm dưới đây
               * https://stackoverflow.com/a/73336101
               * https://mui.com/material-ui/react-radio-button/
               */}
              <Controller
                name="type"
                defaultValue={BOARD_TYPES.PUBLIC}
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row onChange={(event, value) => field.onChange(value)} value={field.value}>
                    <FormControlLabel
                      value={BOARD_TYPES.PUBLIC}
                      control={<Radio size="small" />}
                      label="Public"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value={BOARD_TYPES.PRIVATE}
                      control={<Radio size="small" />}
                      label="Private"
                      labelPlacement="start"
                    />
                  </RadioGroup>
                )}
              />
              <Box sx={{ alignSelf: 'flex-end' }}>
                <Button className="interceptor-loading" type="submit" variant="contained" color="primary">
                  Create
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  )
}

export default CreateBoardModal
