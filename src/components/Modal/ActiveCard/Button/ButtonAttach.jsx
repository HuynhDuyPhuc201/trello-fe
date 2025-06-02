import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'

import { Button, ClickAwayListener, Popover, TextField } from '@mui/material'
import { SidebarItem } from '../SidebarItem'
import { singleFileAttachValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import { useFetchUpdateCard } from '~/hooks/useFetchUpdateCard'
import { useRef, useState } from 'react'

const ButtonAttach = (propsAttach) => {
  const { attachmentUrl, setAttachmentUrl } = propsAttach
  const attachButtonRef = useRef(null)
  const { fetchUpdateCard } = useFetchUpdateCard()
  const [openAttach, setOpenAttach] = useState(false)

  const hanldeUploadFileAttach = async (event) => {
    const files = event.target?.files
    if (!files || files.length === 0) return

    for (let file of files) {
      const error = singleFileAttachValidator(file)
      if (error) {
        toast.error(error)
        continue // bỏ qua file bị lỗi, không làm gì nữa
      }

      const formData = new FormData()
      formData.append('fileAttach', file)
      formData.append('action', 'add')
      await toast.promise(fetchUpdateCard(formData), {
        pending: `Loading...${file.name}`
      })
    }

    event.target.value = ''
    setOpenAttach(false)
  }

  const handleLinkFileAttach = async (url) => {
    if (!url) return
    const updateData = { originalname: url, action: 'add', type: 'link' }
    await toast.promise(fetchUpdateCard(updateData), {
      pending: `Loading...`
    })
    setOpenAttach(false)
    setAttachmentUrl('')
  }

  return (
    <div>
      <Box sx={{ position: 'relative' }}>
        <Box>
          <SidebarItem ref={attachButtonRef} onClick={() => setOpenAttach(!openAttach)}>
            <LocalOfferOutlinedIcon fontSize="small" />
            Attach
          </SidebarItem>
          <Popover
            open={openAttach}
            anchorEl={attachButtonRef?.current}
            onClose={() => setOpenAttach(false)} // bắt buộc vẫn phải có onClose
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            sx={{
              '& .MuiPaper-rounded': {
                width: '300px',
                marginTop: '10px'
              }
            }}
          >
            <Box sx={{ p: 2.5 }}>
              <ClickAwayListener onClickAway={() => setOpenAttach(false)}>
                <Stack spacing={2}>
                  {/* Upload File */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Upload a file
                    </Typography>
                    <Button variant="outlined" component="label" fullWidth>
                      Choose file
                      <input hidden type="file" name="files" onChange={hanldeUploadFileAttach} multiple />
                    </Button>
                  </Box>

                  <Divider />

                  {/* Nhập link */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Link
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Copy link here..."
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 1 }}
                      onClick={() => handleLinkFileAttach(attachmentUrl)}
                    >
                      Add
                    </Button>
                  </Box>
                </Stack>
              </ClickAwayListener>
            </Box>
          </Popover>
        </Box>
      </Box>
    </div>
  )
}

export default ButtonAttach
