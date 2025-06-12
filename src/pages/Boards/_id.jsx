import Container from '@mui/material/Container'
import BoardContent from './BoardContent/BoardContent'
import AppBar from '~/components/AppBar/AppBar'
import { useEffect, useCallback, useState } from 'react'
import { boardService } from '~/services/board.service'
import { columnService } from '~/services/column.service'
import { useDispatch } from 'react-redux'
import {
  clearCurrentActiveBoard,
  getBoardAll,
  getBoardDetail,
  updateCurrentActiveBoard,
  useActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import LoadingSpiner from '~/components/Loading/Loading'
import { Navigate, useParams } from 'react-router-dom'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { useActiveCard } from '~/redux/activeCard/activeCardSlice'
import socket from '~/sockets'
import { useUser } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'
import PrivateBoardDialog from '~/components/PrivateBoardDialog'
import { createJoinRequest, getJoinRequests } from '~/redux/request/joinRequestSlice'
import useBoardSocketEvents from '~/hooks/useBoardSocketEvents'

function Board() {
  const dispatch = useDispatch()
  const { currentActiveBoard, loading } = useActiveBoard()
  const { isShowModalActiveCard } = useActiveCard()
  const { currentUser } = useUser()
  const [errorAccess, setErrorAccess] = useState('')
  const board = currentActiveBoard
  const { boardId } = useParams()

  useBoardSocketEvents(socket)

  const fetchDetailBoard = async () => {
    try {
      const res = await dispatch(getBoardDetail(boardId))
      if (res.payload.message) {
        <Navigate to="/404" />
        return setErrorAccess(res.payload.message)
      }
    } catch (error) {
      console.log('error', error)
    }
  }
  useEffect(() => {
    if (!boardId) return
    fetchDetailBoard()
    dispatch(getBoardAll())
    dispatch(getJoinRequests(boardId))

    return () => {
      if (boardId && currentUser) {
        socket.emit('user_leave_board', { boardId, user: currentUser })
      }
      dispatch(clearCurrentActiveBoard())
    }
  }, [dispatch, boardId, currentUser])
  // Khi board và currentUser có mặt => emit user_join_board
  useEffect(() => {
    if (!board?._id || !currentUser) return

    socket.emit('user_join_board', {
      boardId: board._id,
      user: currentUser
    })
  }, [board?._id, currentUser])

  const moveColumns = useCallback(
    (dndOrderedColumns) => {
      const dndOrderedColumnIds = dndOrderedColumns.map((col) => col._id)

      const newBoard = {
        ...board,
        columns: [...dndOrderedColumns],
        columnOrderIds: [...dndOrderedColumnIds]
      }

      dispatch(updateCurrentActiveBoard(newBoard))

      boardService
        .update(newBoard._id, {
          columnOrderIds: dndOrderedColumnIds
        })
        .then((data) => {
          socket.emit('update_column', data.boardId)
        })
        .catch((err) => {
          toast.error('Cập nhật thứ tự thất bại!', err)
        })
    },
    [board, dispatch]
  )

  const moveCardInTheSameColumn = useCallback(
    (dndOrderedCards, dndOrderedCardIds, columnId) => {
      const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
          if (col._id !== columnId) return col

          return {
            ...col,
            cards: [...dndOrderedCards],
            cardOrderIds: [...dndOrderedCardIds]
          }
        })
      }

      dispatch(updateCurrentActiveBoard(newBoard))

      columnService
        .update(columnId, { cardOrderIds: dndOrderedCardIds })
        .then((data) => {
          socket.emit('update_column', data.boardId)
        })
        .catch((err) => {
          console.error('❌ Failed to update card order:', err)
        })
    },
    [board, dispatch]
  )

  const moveCardToDifferentColumn = useCallback(
    (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
      const newBoard = {
        ...board,
        columns: [...dndOrderedColumns],
        columnOrderIds: dndOrderedColumns.map((col) => col._id)
      }

      dispatch(updateCurrentActiveBoard(newBoard))

      let prevCardOrderIds = dndOrderedColumns.find((col) => col._id === prevColumnId)?.cardOrderIds

      if (prevCardOrderIds?.[0]?.includes('placeholder-card')) {
        prevCardOrderIds = []
      }

      boardService
        .moveCardToDifferentColumn({
          currentCardId,
          prevColumnId,
          prevCardOrderIds,
          nextColumnId,
          nextCardOrderIds: dndOrderedColumns.find((col) => col._id === nextColumnId)?.cardOrderIds
        })
        .then((data) => {
          socket.emit('update_column', data.boardId)
        })
        .catch((err) => {
          console.error('❌ Failed to move card:', err)
        })
    },
    [board, dispatch]
  )
  const [open, setOpen] = useState(true)
  const [openSendit, setOpenSendit] = useState(false)

  const onRequestAccess = async () => {
    if (!boardId || !currentUser) {
      return <Navigate to={'/'} />
    }
    try {
      const res = await dispatch(
        createJoinRequest({
          boardId,
          approvedUserId: currentUser?._id
        })
      ).unwrap()
      if (res) {
        dispatch(getJoinRequests({ boardId: res.boardJoinRequest.boardId }))
        socket.emit('request_join_board', { newRequest: res, user: currentUser })
        setOpenSendit(true)
      }
    } catch (error) {
      console.log('error', error)
    }
  }
  if (!board) {
    if (errorAccess === 'Board not found') {
      return <Navigate to="/" />
    }
    if (errorAccess === 'This is private board') {
      return (
        <PrivateBoardDialog
          open={open}
          onClose={(event, reason) => {
            if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
            setOpen(false)
          }}
          onRequestAccess={onRequestAccess}
          openSendit={openSendit}
        />
      )
    }
    if (loading) {
      return <LoadingSpiner caption="Loading board..." />
    }
    if (errorAccess) {
      return <Navigate to="/404" />
    }
  }

  return (
    <Container disableGutters sx={{ height: '100vh' }} maxWidth={false}>
      {isShowModalActiveCard && <ActiveCard />}
      <AppBar />
      {/* <BoardBar board={board} colorConfigs={findColor} /> */}
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
