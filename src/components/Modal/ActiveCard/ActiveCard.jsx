import { useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import ActiveCardDescription from './component/ActiveCardDescription'
import ActiveCardComment from './component/ActiveCardComment'

import {
  clearAndHideCurrentActiveCard,
  deleteCard,
  updateCurrentActiveCard,
  useActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { useDispatch } from 'react-redux'
import { getBoardDetail } from '~/redux/activeBoard/activeBoardSlice'
import { Button, Checkbox, ClickAwayListener, Popover, TextField, Tooltip } from '@mui/material'
import { API_ROOT_FE, COLORS, imageCards } from '~/config/constants'
import ActiveCardTitle from './component/ActiveCardTitle'
import ActiveCardAttach from './component/ActiveCardAttach'
import { useLocation, useParams } from 'react-router-dom'
import ActiveCardTodolist from './component/ActiveCardTodolist'
import { useConfirm } from 'material-ui-confirm'
import ActiveCardMember from './component/ActiveCardMember'
import { useFetchUpdateCard } from '~/hooks/useFetchUpdateCard'
import ButtonCover from './Button/ButtonCover'
import ButtonAttach from './Button/ButtonAttach'
import ButtonCheckList from './Button/ButtonCheckList'
import ButtonJoin from './Button/ButtonJoin'
import { SidebarItem } from './SidebarItem'
import ButtonMember from './Button/ButtonMember'
import { useUser } from '~/redux/user/userSlice'
import ButtonDate from './Button/ButtonDate'
import ActiveCardDate from './component/ActiveCardDate'
import ButtonMoveCard from './Button/ButtonMoveCard'
import socket from '~/sockets'

function ActiveCard() {
  const [openCoverPopover, setOpenCoverPopover] = useState(false)
  const coverButtonRef = useRef(null)
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [shareLink, setShareLink] = useState(false)
  const shareLinkRef = useRef(null)
  const isFirstRender = useRef(true)
  const { currentUser } = useUser()
  const { currentActiveCard, isShowModalActiveCard } = useActiveCard()
  const activeCard = currentActiveCard
  const [done, setDone] = useState(activeCard?.done || false)

  const dispatch = useDispatch()

  const { boardId } = useParams()
  const { fetchUpdateCard } = useFetchUpdateCard(activeCard._id)

  const { pathname } = useLocation()
  const fullUrl = `${API_ROOT_FE}${pathname}`
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  useEffect(() => {
    const handleActiveCard = (updateCard) => {
      dispatch(updateCurrentActiveCard(updateCard))
    }
    socket.on('update_activeCard', handleActiveCard)
    return () => {
      socket.off('update_activeCard', handleActiveCard)
    }
  }, [dispatch])

  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
  }

  const onUpdateCard = useCallback(
    (type, value) => {
      return fetchUpdateCard({ [type]: value.trim() })
    },
    [fetchUpdateCard]
  )

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
  }, [done, fetchUpdateCard])

  //------------------------------handle cover----------------------------
  const onUploadCardCover = async (event) => {
    const file = event.target?.files?.[0]
    const error = singleFileValidator(file)
    if (error) {
      toast.error(error)
      return
    }
    let formData = new FormData()
    formData.append('cover', file)

    toast.promise(fetchUpdateCard(formData), { pending: 'Updating...' }).then(() => {
      event.target.value = ''
      setOpenCoverPopover(false)
    })
  }

  const colorActiveCard = activeCard && typeof activeCard?.cover !== 'object' && activeCard?.cover?.startsWith('#')

  const confirmDeleteColumn = useConfirm()
  const handleDeleteCard = async () => {
    try {
      await confirmDeleteColumn({
        title: 'Delete Card?',
        description:
          'All activities on the card will be removed from your activities panel and you will not be able to reopen the card. There will be no way to complete it. Are you sure?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      })
      dispatch(deleteCard(activeCard._id)).unwrap()
      const res = await dispatch(getBoardDetail(boardId)).unwrap()
      if (res) {
        socket.emit('delete_card', res.boardId)
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to delete card. Please try again later.')
    }
  }

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
          margin: {
            xs: '50px 20px',
            sm: '50px 20px',
            md: '50px auto'
          },
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

        <Box sx={{ position: 'relative' }}>
          {activeCard?.cover && (
            <>
              <Box
                sx={{
                  mb: 4,
                  backgroundColor: colorActiveCard ? activeCard?.cover : 'transparent',
                  width: '100%',
                  height: {
                    xs: '150px',
                    sm: '150px',
                    md: '200px'
                  },
                  borderRadius: '6px'
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
                  anchorEl={coverButtonRef?.current}
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
                        {COLORS?.map((color, index) => (
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
            </>
          )}
        </Box>

        {/* 01:  title */}
        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={!done ? 'Đánh dấu hoàn tất' : 'Đánh dấu chưa hoàn tất'}>
            <Checkbox sx={{ p: 0 }} checked={done} onChange={() => setDone((prev) => !prev)} />
          </Tooltip>
          <ActiveCardTitle onUpdateCard={onUpdateCard} />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>
            <ActiveCardDate />
            <ActiveCardMember />
            <ActiveCardDescription onUpdateCard={onUpdateCard} />
            <ActiveCardAttach />
            <ActiveCardTodolist />
            <ActiveCardComment />
          </Grid>

          {/* Right side */}
          <Grid xs={12} sm={3}>
            <Stack direction="column" spacing={1}>
              {!activeCard?.memberIds?.includes(currentUser._id) && <ButtonJoin />}
              <ButtonMember />
              {!currentActiveCard?.cover && (
                <ButtonCover
                  setOpenCoverPopover={setOpenCoverPopover}
                  openCoverPopover={openCoverPopover}
                  coverButtonRef={coverButtonRef}
                  onUploadCardCover={onUploadCardCover}
                  onUpdateCard={onUpdateCard}
                />
              )}

              <ButtonAttach attachmentUrl={attachmentUrl} setAttachmentUrl={setAttachmentUrl} />
              <ButtonCheckList />
              <ButtonDate />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>
            <Stack direction="column" spacing={1}>
              <ButtonMoveCard />
              <SidebarItem onClick={handleDeleteCard}>
                <DeleteIcon fontSize="small" />
                Delete
              </SidebarItem>

              {/* Share: chia sẻ */}
              <Box sx={{ position: 'relative' }}>
                <Box>
                  <SidebarItem ref={shareLinkRef} onClick={() => setShareLink(!shareLink)}>
                    <ShareOutlinedIcon fontSize="small" />
                    Share
                  </SidebarItem>
                  <Popover
                    open={shareLink}
                    anchorEl={shareLinkRef?.current}
                    onClose={() => setShareLink(false)}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left'
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                    sx={{
                      '& .MuiPaper-rounded': {
                        width: '300px',
                        padding: '8px',
                        marginTop: '-10px'
                      }
                    }}
                  >
                    <ClickAwayListener onClickAway={() => setShareLink(false)}>
                      <Stack spacing={2}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>
                          Share link
                        </Typography>
                        <Divider />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Link to this board
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="Link trello this board..."
                              value={`${API_ROOT_FE}${pathname}`}
                              onChange={(e) => setAttachmentUrl(e.target.value)}
                            />
                            <Button
                              variant="contained"
                              color={copied ? 'success' : 'primary'}
                              onClick={handleCopy}
                              startIcon={<ContentCopyIcon />}
                            >
                              {copied ? 'Copied!' : 'Copy'}
                            </Button>
                          </Box>
                        </Box>
                      </Stack>
                    </ClickAwayListener>
                  </Popover>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard
