import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { imageAttach } from '~/config/constants'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { Dialog } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddLinkIcon from '@mui/icons-material/AddLink'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { useActiveCard } from '~/redux/activeCard/activeCardSlice'
import { useFetchUpdateCard } from '~/hooks/useFetchUpdateCard'
import TitleActiveCard from './TitleActiveCard'

const ActiveCardAttach = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)
  const { currentActiveCard } = useActiveCard()
  const { fetchUpdateCard } = useFetchUpdateCard()

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']

  const isImageFile = (filename) => {
    if (!filename) return false
    const extension = filename.split('.').pop().toLowerCase()
    return imageExtensions.includes(extension)
  }

  const handleMenuOpen = (event, file) => {
    setAnchorEl(event.currentTarget)
    setSelectedFile(file)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedFile(null)
  }

  const handleDelete = () => {
    if (selectedFile) {
      const updatedFileAttach = (currentActiveCard?.fileAttach || []).filter((c) => c._id !== selectedFile._id)
      fetchUpdateCard({ fileAttach: updatedFileAttach })
    }
    handleMenuClose()
  }
  const handlePreview = (file) => {
    if (file?.type === 'link') {
      window.open(file.originalname, '_blank')
      return
    }
    setPreviewFile(file)
    setPreviewOpen(true)
  }

  return (
    <>
      {currentActiveCard?.fileAttach && currentActiveCard?.fileAttach.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <TitleActiveCard icon={<AttachmentIcon />} text="Attachment" />
          <Box sx={{ marginTop: 2, paddingLeft: { xs: 0, sm: 0, md: 5 } }}>
            {currentActiveCard?.fileAttach?.length > 0 &&
              currentActiveCard.fileAttach?.map((file, i) => {
                const isImage = isImageFile(file?.filename)
                const isLink = file?.type === 'link'
                const fileUrl = isLink ? file?.filename : imageAttach(file)

                return (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      gap: '10px',
                      paddingBottom: '10px',
                      position: 'relative',
                      cursor: 'pointer',
                      flexDirection: { xs: 'column', sm: 'row' }, 
                      alignItems: { xs: 'flex-start', sm: 'center' }
                    }}
                    onClick={() => handlePreview(file)}
                  >
                    {isLink ? (
                      <Box
                        sx={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '6px',
                          backgroundColor: '#e3f2fd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <AddLinkIcon fontSize="large" color="primary" />
                      </Box>
                    ) : isImage ? (
                      <img
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '6px',
                          objectFit: 'cover'
                        }}
                        src={fileUrl}
                        alt={file?.originalname}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '6px',
                          backgroundColor: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <InsertDriveFileIcon fontSize="large" />
                      </Box>
                    )}

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        width: '100%',
                        position: 'relative'
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: '14px',
                          height: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          whiteSpace: {
                            xs: 'normal',
                            sm: 'nowrap'
                          },
                          overflow: {
                            xs: 'visible',
                            sm: 'hidden'
                          },
                          textOverflow: {
                            xs: 'unset',
                            sm: 'ellipsis'
                          },
                          minWidth: 0,
                          paddingRight: '35px'
                        }}
                      >
                        {file?.originalname}
                      </Box>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMenuOpen(e, file)
                        }}
                        sx={{
                          height: '30px',
                          position: { xs: 'static', sm: 'absolute' },
                          right: { sm: 10 },
                          alignSelf: { xs: 'flex-end', sm: 'center' }
                        }}
                      >
                        <MoreHorizIcon
                          sx={{
                            fontSize: 20,
                            color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c')
                          }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                )
              })}

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </Box>
          <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
            <Box p={2.5}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box fontWeight="bold">{previewFile?.originalname}</Box>
                <IconButton onClick={() => setPreviewOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {isImageFile(previewFile?.filename) ? (
                <img
                  src={imageAttach(previewFile)}
                  alt={previewFile?.originalname}
                  style={{ width: '100%', borderRadius: 8 }}
                />
              ) : (
                <iframe
                  src={imageAttach(previewFile)}
                  title={previewFile?.originalname}
                  style={{ width: '100%', height: '500px', border: 'none' }}
                />
              )}
            </Box>
          </Dialog>
        </Box>
      )}
    </>
  )
}

export default ActiveCardAttach
