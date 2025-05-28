import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import { API_ROOT, imageAttach } from '~/config/constants'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { Dialog } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddLinkIcon from '@mui/icons-material/AddLink'

const ActiveCardAttach = ({ onUpdateCard, activeCard, onDeleteAttach }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)

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
    if (typeof onDeleteAttach === 'function' && selectedFile) {
      onDeleteAttach(selectedFile)
    }
    handleMenuClose()
  }

  const handlePreview = (file) => {
    if (file?.type === 'link') {
      window.open(file?.filename, '_blank')
      return
    }
    setPreviewFile(file)
    setPreviewOpen(true)
  }

  return (
    <>
      <Box sx={{ marginTop: 2, paddingLeft: 5}}>
        {activeCard?.fileAttach?.length > 0 &&
          activeCard.fileAttach?.map((file, i) => {
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
                  alignItems: 'center',
                  cursor: 'pointer'
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
                    fontSize: '14px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center'
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
                  sx={{ height: '30px', position: 'absolute', right: 10 }}
                >
                  <MoreHorizIcon
                    sx={{
                      fontSize: 20,
                      color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000')
                    }}
                  />
                </IconButton>
              </Box>
            )
          })}

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Box>
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <Box p={2}>
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
    </>
  )
}

export default ActiveCardAttach
