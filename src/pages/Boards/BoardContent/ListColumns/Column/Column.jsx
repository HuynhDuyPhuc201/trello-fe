import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import { useEffect, useRef, useState } from 'react'

import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Cloud from '@mui/icons-material/Cloud'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import Divider from '@mui/material/Divider'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { cardService } from '~/services/card.service'
import { updateCurrentActiveBoard, useActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch } from 'react-redux'
import { columnService } from '~/services/column.service'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import socket from '~/sockets'

function Column({ column, isOpen, onOpenForm, onCloseForm }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dispatch = useDispatch()
  const { currentActiveBoard } = useActiveBoard()
  const board = currentActiveBoard

  // fix bug Transform -> Translate
  const dndKitColumnStyles = {
    // https://docs.dndkit.com/api-documentation/sensors/pointer
    // touchAction: 'none', // dành cho sensor default dạng PointerSensor

    // nếu sử dụng css.Transform như docs sẽ bị lỗi kiểu stretch
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Cards đã được sx ở component cha cao nhất (board/_id.jsx) (video 71 đã giải thích lí do)

  const orderedCards = column.cards

  const [newCardTitle, setNewCardTitle] = useState('')

  // gọi API tạo mới Card và làm lại dữ liệu Board

  // useEffect(() => {
  //   const handleCardAndColumn = (Invitation) => {
  //     // dispatch(getInvite()) // không cần gọi lại getInvite vì đã có useNotification
  //     // nếu có thông báo mới thì sẽ tự động cập nhật vào currentNotification
  //     if (Invitation.inviteeId === currentUser._id) {
  //       dispatch(addNotification(Invitation))
  //     }
  //   }
  //   socket.on('handle_card_and_column', (Invitation) => handleCardAndColumn(Invitation))
  //   return () => {
  //     socket.off('handle_card_and_column', handleCardAndColumn)
  //   }
  // })

  const addNewCard = async () => {
    const title = newCardTitle.trim()

    if (!title) {
      toast.error('Please enter card title', { position: 'bottom-right' })
      return
    }

    try {
      const newCardData = {
        title,
        columnId: column._id,
        boardId: board._id
      }

      const createdCard = await cardService.create(newCardData)

      if (!createdCard) throw new Error('Failed to create card')

      const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
          if (col._id !== createdCard.columnId) return col

          const hasPlaceholder = col.cards.some((card) => card.FE_PlaceholderCard)
          if (hasPlaceholder) {
            return {
              ...col,
              cards: [createdCard],
              cardOrderIds: [createdCard._id]
            }
          }

          return {
            ...col,
            cards: [...col.cards, createdCard],
            cardOrderIds: [...col.cardOrderIds, createdCard._id]
          }
        })
      }

      dispatch(updateCurrentActiveBoard(newBoard))
      onCloseForm()
      setNewCardTitle('')
    } catch (err) {
      console.error('Error creating card:', err)
      toast.error('Something went wrong while adding card')
    }
  }

  // xử lý xóa 1 Column và Cards bên trong nó
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = async () => {
    try {
      await confirmDeleteColumn({
        title: 'Delete Column?',
        description: 'This action will permanently delete the column and all its cards. Are you sure?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      })

      // Tạo newBoard với column đã bị xoá
      const newBoard = {
        ...board,
        columns: board.columns.filter((col) => col._id !== column._id),
        columnOrderIds: board.columnOrderIds.filter((id) => id !== column._id)
      }

      dispatch(updateCurrentActiveBoard(newBoard))

      try {
        const res = await columnService.delete(column._id)
        toast.success(res?.deleteResult || 'Deleted successfully!')
      } catch (err) {
        console.error('❌ Failed to delete column:', err)
        toast.error('Failed to delete column from server.')
      }
    } catch {
      toast.info('Delete canceled')
    }
  }

  const handleUpdateColumnTitle = async (newTitle) => {
    try {
      await columnService.update(column._id, { title: newTitle })
    } catch (err) {
      toast.error('Failed to update column title from server.')
    }
  }

  return (
    //  phải bọc div ở đây vì vấn đề chiều cao của column khi kéo thả sẽ có bug kiểu kiểu flickering (video 32)
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        {/* box column header */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <ToggleFocusInput data-no-dnd="true" value={column?.title} onChangedValue={handleUpdateColumnTitle} />
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-dropdown"
              z
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem
                onClick={onOpenForm}
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .add-card-icon': {
                      color: 'success.light'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <AddCardIcon className="add-card-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': {
                      color: 'warning.dark'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <DeleteForeverIcon className="delete-forever-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* box list cart */}
        <ListCards cards={orderedCards} />

        {/* box column footer */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2
          }}
        >
          {!isOpen ? (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Button startIcon={<AddCardIcon />} onClick={onOpenForm}>
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="Enter card title..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': { borderRadius: 1 }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addNewCard()
                  }
                  if (e.key === 'Escape') {
                    onCloseForm()
                    setNewCardTitle('')
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  className="interceptor-loading"
                  variant="contained"
                  color="success"
                  size="small"
                  data-no-dnd="true"
                  onClick={addNewCard}
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': {
                      bgColor: (theme) => theme.palette.success.main
                    }
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { color: (theme) => theme.palette.warning.light }
                  }}
                  onClick={onCloseForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Column
