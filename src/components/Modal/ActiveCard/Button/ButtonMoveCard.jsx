import { useEffect, useRef, useState } from 'react'
import { Button, Popover, Select, MenuItem, InputLabel, FormControl, Box, Typography } from '@mui/material'
import { getBoardDetail, useActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { boardService } from '~/services/board.service'
import { SidebarItem } from '../SidebarItem'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import {
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard,
  useActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { useDispatch } from 'react-redux'
import { cardService } from '~/services/card.service'
import socket from '~/sockets'

const ButtonMoveCard = () => {
  const { boards, currentActiveBoard } = useActiveBoard()
  const { currentActiveCard } = useActiveCard()

  const [boardId, setBoardId] = useState('')
  const [toColumnId, setToColumnId] = useState('')
  const [position, setPosition] = useState(0)
  const [boardDetail, setBoardDetail] = useState({})
  const [indexCard, setIndexCard] = useState([])
  const [open, setOpen] = useState(false)

  const isRender = useRef(true)

  const buttonMoveRef = useRef()
  const dispatch = useDispatch()
  const { columnId } = currentActiveCard
  const handleClose = () => {
    setOpen(false)
    setBoardId('')
    setToColumnId('')
    setPosition('')
  }
  const handleMoveCard = async () => {
    const moveCard = {
      cardId: currentActiveCard._id,
      fromColumnId: columnId,
      boardId,
      toColumnId,
      toPosition: position
    }

    try {
      const updatedCard = await cardService.update(currentActiveCard._id, { moveCard })
      if (updatedCard) {
        dispatch(updateCurrentActiveCard(updatedCard)).unwrap()
      }
    } catch (error) {
      console.log('error', error)
    }
    dispatch(getBoardDetail(currentActiveBoard._id)).unwrap()
    dispatch(clearAndHideCurrentActiveCard())
    socket.emit('delete_card', currentActiveBoard._id)
    handleClose()
  }

  const fetchBoardDetail = async (id) => {
    try {
      const res = await boardService.getDetails(id)
      setBoardDetail(res)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    if (isRender.current) {
      isRender.current = false
      return
    }
    if (typeof boardId === 'string' && boardId !== '') {
      fetchBoardDetail(boardId)
    }
  }, [boardId])

  useEffect(() => {
    if (!boardDetail?.columns) return
    const IndexCard = boardDetail.columns.filter((col) => col._id === toColumnId)
    setIndexCard(IndexCard)
  }, [toColumnId, boardDetail])

  const newBoard = boards.filter((item) => item._id !== currentActiveBoard._id)
  return (
    <>
      <SidebarItem ref={buttonMoveRef} onClick={() => setOpen(!open)}>
        <ArrowForwardOutlinedIcon fontSize="small" />
        Move
      </SidebarItem>
      <Popover
        open={open}
        anchorEl={buttonMoveRef?.current}
        onClose={handleClose}
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
            width: '300px'
          }
        }}
      >
        <Box p={2.5} width={300} display="flex" flexDirection="column" gap={2}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }} textAlign={'center'}>
            Move
          </Typography>

          <FormControl fullWidth size="small">
            <InputLabel>Board</InputLabel>
            <Select value={boardId} onChange={(e) => setBoardId(e.target.value)} label="Board">
              {newBoard?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            size="small"
            sx={{
              opacity: !boardDetail?.columns || boardDetail.columns.length === 0 ? 0.5 : 1
            }}
          >
            <InputLabel>Column</InputLabel>
            <Select
              disabled={!boardDetail?.columns || boardDetail.columns.length === 0}
              value={toColumnId}
              onChange={(e) => setToColumnId(e.target.value)}
              label="Column"
            >
              {boardDetail?.columns?.map((col) => (
                <MenuItem key={col._id} value={col._id}>
                  {col.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            size="small"
            sx={{
              opacity: !boardDetail?.columns || boardDetail.columns.length === 0 ? 0.5 : 1
            }}
          >
            <InputLabel>Index</InputLabel>
            <Select
              disabled={!indexCard?.[0]?.cards}
              value={position + 1}
              onChange={(e) => setPosition(Number(e.target.value) - 1)}
              label="Index"
            >
              {indexCard?.[0]?.cards?.map((_, pos) => (
                <MenuItem key={pos} value={pos + 1}>
                  {pos + 1}
                </MenuItem>
              ))}
              <MenuItem value={(indexCard?.[0]?.cards?.length || 0) + 1}>
                {(indexCard?.[0]?.cards?.length || 0) + 1}
              </MenuItem>
            </Select>
          </FormControl>

          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleMoveCard}>
              Move
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  )
}

export default ButtonMoveCard
