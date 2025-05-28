import { useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import DeleteIcon from '@mui/icons-material/Delete'

import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileAttachValidator, singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import CardUserGroup from './CardUserGroup'
import ActiveCardDescription from './ActiveCardDescription'
import ActiveCardComment from './ActiveCardComment'
import AttachmentIcon from '@mui/icons-material/Attachment'

import { styled } from '@mui/material/styles'
import {
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard,
  useActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { useDispatch } from 'react-redux'
import { cardService } from '~/services/card.service'
import { getBoardDetail, useActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { Button, Checkbox, ClickAwayListener, Popover, TextField, Tooltip } from '@mui/material'
import { API_ROOT, CARD_MEMBER_ACTION, COLORS, imageCards } from '~/config/constants'
import ActiveCardTitle from './ActiveCardTitle'
import { useUser } from '~/redux/user/userSlice'
import ActiveCardAttach from './ActiveCardAttach'
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

function ActiveCard() {
  const [openCoverPopover, setOpenCoverPopover] = useState(false)
  const [openAttach, setOpenAttach] = useState(false)
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const coverButtonRef = useRef(null)
  const attachButtonRef = useRef(null)
  const labelButtonRef = useRef(null)
  const checkListButtonRef = useRef(null)
  const dateButtonRef = useRef(null)
  const { currentActiveCard, isShowModalActiveCard } = useActiveCard()
  const activeCard = currentActiveCard
  const [done, setDone] = useState(activeCard?.done || false)
  const isFirstRender = useRef(true)
  const dispatch = useDispatch()

  const { currentUser } = useUser()

  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
  }

  const fetchUpdateCard = useCallback(
    async (updateData) => {
      try {
        const updatedCard = await cardService.update(activeCard._id, updateData)
        if (updatedCard) {
          dispatch(updateCurrentActiveCard(updatedCard))
          dispatch(getBoardDetail(updatedCard.boardId))
        }
        return { success: true, updatedCard }
      } catch (error) {
        toast.error('Failed to update card. Please try again.')
      }
    },
    [activeCard._id, dispatch]
  )

  const onChangeDone = () => {
    setDone((prev) => !prev)
  }

  useEffect(() => {
    setDone(activeCard?.done || false)
  }, [activeCard])

  // bỏ qua lần chạy đầu tiên: vì lúc đầu done = false
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    fetchUpdateCard({ done })
  }, [done])

  const onUpdateCard = useCallback(
    (type, value) => {
      fetchUpdateCard({ [type]: value.trim() })
    },
    [fetchUpdateCard]
  )

  const onUploadCardCover = async (event) => {
    const file = event.target?.files?.[0]
    const error = singleFileValidator(file)
    if (error) {
      toast.error(error)
      return
    }
    let formData = new FormData()
    formData.append('cover', file) // 👈 key phải trùng với backend

    toast.promise(fetchUpdateCard(formData), { pending: 'Updating...' }).then(() => {
      event.target.value = ''
      toast.success('Update successfully!')
      setOpenCoverPopover(false)
    })
  }
  const onUploadFileAttach = async (event) => {
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
      // Chờ upload xong file này rồi mới qua file kế
      await toast.promise(fetchUpdateCard(formData), {
        pending: `Loading...${file.name}`
      })
    }

    // Reset input và đóng popover sau khi tất cả upload xong
    event.target.value = ''
    setOpenAttach(false)
  }

  const onAddCardComment = (commentToAdd) => {
    return fetchUpdateCard({ commentToAdd })
  }

  const onUpdateCardMembers = async (inComingMemberInfor) => {
    return fetchUpdateCard({ inComingMemberInfor })
  }

  const onEditCardComment = useCallback(
    (commentId, valueEditComment) => {
      const listCommentEdited = activeCard?.comments.map((comment) => {
        if (comment._id === commentId) {
          return {
            ...comment, // clone nó ra
            content: valueEditComment,
            commentedAt: Date.now()
          }
        }
        return comment
      })
      return fetchUpdateCard({ comments: listCommentEdited })
    },
    [fetchUpdateCard, activeCard?.comments]
  )

  // on delete
  const onDeleteCardComment = useCallback(
    (comment) => {
      fetchUpdateCard({ comments: [...(activeCard?.comments || []).filter((c) => c._id !== comment._id)] })
    },
    [fetchUpdateCard, activeCard?.comments]
  )

  const onDeleteAttach = useCallback(
    (file) => {
      const updatedFileAttach = (activeCard?.fileAttach || []).filter((c) => c._id !== file._id)
      fetchUpdateCard({ fileAttach: updatedFileAttach })
    },
    [fetchUpdateCard, activeCard?.fileAttach]
  )

  const onAttachdLink = async (url) => {
    if (!url) return
    // Xử lý attach link vào card ở đây
    await toast.promise(
      fetchUpdateCard({
        fileAttach: {
          originalname: url,
          type: 'link'
        }
      }),
      {
        pending: `Loading...`
      }
    )
    setOpenAttach(false)
    setAttachmentUrl('')
  }

  const colorActiveCard = activeCard && typeof activeCard?.cover !== 'object' && activeCard?.cover?.startsWith('#')

  return (
    <Modal disableScrollLock open={isShowModalActiveCard} onClose={handleCloseModal} sx={{ overflowY: 'auto' }}>
      <Box
        sx={{
          position: 'relative',
          maxWidth: 900,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '40px 20px 20px',
          margin: '50px auto',
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fafafa')
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '12px',
            right: '10px',
            cursor: 'pointer'
          }}
        >
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

        {activeCard?.cover && (
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                mb: 4,
                backgroundColor: colorActiveCard ? activeCard?.cover : 'transparent',
                width: '100%',
                height: '200px'
              }}
            >
              {!colorActiveCard && (
                <img
                  style={{ width: '100%', height: '200px', borderRadius: '6px', objectFit: 'cover' }}
                  src={imageCards(activeCard)}
                  alt="card-cover"
                />
              )}
            </Box>
            <Box
              sx={{ position: 'absolute', bottom: 20, right: 20 }}
              onClick={() => setOpenCoverPopover(!openCoverPopover)}
            >
              <Button
                ref={coverButtonRef}
                sx={{ display: 'flex', gap: '3px' }}
                variant="contained"
                onClick={() => setOpenCoverPopover(!openCoverPopover)}
              >
                <ImageOutlinedIcon fontSize="small" />
                Cover
              </Button>
              <Popover
                open={openCoverPopover}
                anchorEl={coverButtonRef.current}
                onClose={() => setOpenCoverPopover(false)}
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
                    padding: '8px',
                    marginTop: '10px'
                  }
                }}
              >
                <Box>
                  <SidebarItem className="active" component="label" onClick={() => onUpdateCard('cover', '')}>
                    <DeleteIcon fontSize="small" />
                    Remove
                  </SidebarItem>
                  <Divider sx={{ py: 1 }} />
                  <Box>
                    <Typography sx={{ py: 1, fontSize: '12px' }}>Color</Typography>
                    <Grid container spacing={1}>
                      {COLORS.map((color, index) => (
                        <Grid key={index} xs={4} md={3}>
                          <Box
                            sx={{ height: '30px', backgroundColor: color, borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => onUpdateCard('cover', color)}
                          ></Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  <Divider sx={{ py: 1 }} />
                  <Box>
                    <Typography sx={{ py: 1, fontSize: '12px' }}>File</Typography>
                    <SidebarItem className="active" component="label">
                      <ImageOutlinedIcon fontSize="small" />
                      Cover
                      <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
                    </SidebarItem>
                  </Box>
                </Box>
              </Popover>
            </Box>
          </Box>
        )}

        {/* 01:  title */}
        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={!done ? 'Đánh dấu hoàn tất' : 'Đánh dấu chưa hoàn tất'}>
            <Checkbox sx={{ p: 0 }} checked={done} onChange={onChangeDone} />
          </Tooltip>
          <ActiveCardTitle onUpdateCard={onUpdateCard} />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>
            {/* 02:  Members */}
            <Box sx={{ mb: 3, paddingLeft: 5 }}>
              <Typography sx={{ fontWeight: '400', color: 'primary.main', mb: 1 }}>Members</Typography>
              <CardUserGroup cardMemberIds={activeCard?.memberIds} onUpdateCardMembers={onUpdateCardMembers} />
            </Box>

            {/* 03:  Description */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant="span" sx={{ fontWeight: '400', fontSize: '20px' }}>
                  Description
                </Typography>
              </Box>
              <ActiveCardDescription onUpdateCard={onUpdateCard} />
            </Box>

            {/* 04:  Attach */}
            {activeCard?.fileAttach && activeCard?.fileAttach.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AttachmentIcon />
                  <Typography variant="span" sx={{ fontWeight: '400', fontSize: '20px' }}>
                    Attachment
                  </Typography>
                </Box>
                <ActiveCardAttach onUpdateCard={onUpdateCard} activeCard={activeCard} onDeleteAttach={onDeleteAttach} />
              </Box>
            )}

            {/* 05:  Activity - comment */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '400', fontSize: '20px' }}>
                  Activity
                </Typography>
              </Box>
              <ActiveCardComment
                onAddCardComment={onAddCardComment}
                onDeleteCardComment={onDeleteCardComment}
                onEditCardComment={onEditCardComment}
              />
            </Box>
          </Grid>

          {/* Right side */}
          <Grid xs={12} sm={3}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
            <Stack direction="column" spacing={1}>
              {/* 05: Join*/}

              {!activeCard?.memberIds?.includes(currentUser._id) && (
                <SidebarItem
                  className="active"
                  onClick={() =>
                    onUpdateCardMembers({
                      userId: currentUser._id,
                      action: CARD_MEMBER_ACTION.ADD
                    })
                  }
                >
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  Join
                </SidebarItem>
              )}

              {/* 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              {!activeCard?.cover && (
                <Box onClick={() => setOpenCoverPopover(!openCoverPopover)}>
                  <SidebarItem
                    ref={coverButtonRef}
                    className="active"
                    component="label"
                    onClick={() => setOpenCoverPopover(!openCoverPopover)}
                  >
                    <ImageOutlinedIcon fontSize="small" />
                    Cover
                  </SidebarItem>
                  <Popover
                    open={openCoverPopover}
                    anchorEl={coverButtonRef.current}
                    onClose={() => setOpenCoverPopover(false)}
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
                        padding: '8px',
                        marginTop: '10px'
                      }
                    }}
                  >
                    <Box>
                      <Box>
                        <Typography sx={{ py: 1, fontSize: '12px' }}>Color</Typography>
                        <Grid container spacing={1}>
                          {COLORS.map((color, index) => (
                            <Grid key={index} xs={4} md={3}>
                              <Box
                                sx={{ height: '30px', backgroundColor: color, borderRadius: '4px', cursor: 'pointer' }}
                                onClick={() => onUpdateCard('cover', color)}
                              ></Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                      <Divider sx={{ py: 1 }} />
                      <Box>
                        <Typography sx={{ py: 1, fontSize: '12px' }}>File</Typography>
                        <SidebarItem className="active" component="label">
                          <ImageOutlinedIcon fontSize="small" />
                          Cover
                          <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
                        </SidebarItem>
                      </Box>
                    </Box>
                  </Popover>
                </Box>
              )}

              <Box sx={{ position: 'relative' }}>
                <Box>
                  <SidebarItem ref={attachButtonRef} onClick={() => setOpenAttach(!openAttach)}>
                    <LocalOfferOutlinedIcon fontSize="small" />
                    Attach
                  </SidebarItem>
                  <Popover
                    open={openAttach}
                    anchorEl={attachButtonRef.current}
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
                        padding: '8px',
                        marginTop: '10px'
                      }
                    }}
                  >
                    <ClickAwayListener onClickAway={() => setOpenAttach(false)}>
                      <Stack spacing={2}>
                        {/* Upload File */}
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Upload a file
                          </Typography>
                          <Button variant="outlined" component="label" fullWidth>
                            Chọn tệp
                            <input hidden type="file" name="files" onChange={onUploadFileAttach} multiple />
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
                            placeholder="Dán link liên kết ở đây..."
                            value={attachmentUrl}
                            onChange={(e) => setAttachmentUrl(e.target.value)}
                          />
                          <Button variant="contained" sx={{ mt: 1 }} onClick={() => onAttachdLink(attachmentUrl)}>
                            Add
                          </Button>
                        </Box>
                      </Stack>
                    </ClickAwayListener>
                  </Popover>
                </Box>
              </Box>

              <SidebarItem>
                <LocalOfferOutlinedIcon fontSize="small" />
                Labels
              </SidebarItem>
              <SidebarItem>
                <TaskAltOutlinedIcon fontSize="small" />
                Checklist
              </SidebarItem>
              <SidebarItem>
                <WatchLaterOutlinedIcon fontSize="small" />
                Dates
              </SidebarItem>
              <SidebarItem>
                <AutoFixHighOutlinedIcon fontSize="small" />
                Custom Fields
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Power-Ups</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem>
                <AspectRatioOutlinedIcon fontSize="small" />
                Card Size
              </SidebarItem>
              <SidebarItem>
                <AddToDriveOutlinedIcon fontSize="small" />
                Google Drive
              </SidebarItem>
              <SidebarItem>
                <AddOutlinedIcon fontSize="small" />
                Add Power-Ups
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem>
                <ArrowForwardOutlinedIcon fontSize="small" />
                Move
              </SidebarItem>
              <SidebarItem>
                <ContentCopyOutlinedIcon fontSize="small" />
                Copy
              </SidebarItem>
              <SidebarItem>
                <AutoAwesomeOutlinedIcon fontSize="small" />
                Make Template
              </SidebarItem>
              <SidebarItem>
                <ArchiveOutlinedIcon fontSize="small" />
                Archive
              </SidebarItem>
              <SidebarItem>
                <ShareOutlinedIcon fontSize="small" />
                Share
              </SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard
