import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import AppBar from '~/components/AppBar/AppBar'
import { useEffect, useCallback } from 'react'
import { boardService } from '~/services/board.service'
import { columnService } from '~/services/column.service'
import { useDispatch } from 'react-redux'
import {
  clearCurrentActiveBoard,
  getBoardAll,
  getBoardDetail,
  updateCurrentActiveBoard,
  updateMemberBoardBar,
  useActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import LoadingSpiner from '~/components/Loading/Loading'
import { useParams } from 'react-router-dom'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { useActiveCard } from '~/redux/activeCard/activeCardSlice'
import { generateColorConfigs } from '~/utils/getTextColor'
import socket from '~/sockets'
import { useUser } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'

function Board() {
  const dispatch = useDispatch()
  const { currentActiveBoard } = useActiveBoard()
  const { isShowModalActiveCard } = useActiveCard()
  const { currentUser } = useUser()

  const board = currentActiveBoard
  const { boardId } = useParams()

  // Lấy thông tin board + tất cả board
  useEffect(() => {
    if (!boardId) return
    dispatch(getBoardDetail(boardId))
    dispatch(getBoardAll())

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

  // Lắng nghe người mới join
  useEffect(() => {
    const handleUserJoin = (newUser) => {
      dispatch(updateMemberBoardBar({ user: newUser, type: 'join' }))
    }
    const boardMemeber = ({ members }) => {
      dispatch(updateMemberBoardBar({ members, type: 'set' }))
    }
    const handleUserLeave = (leftUser) => {
      dispatch(updateMemberBoardBar({ user: leftUser, type: 'leave' }))
    }
    socket.on('user_join_board', handleUserJoin)
    socket.on('current_board_members', boardMemeber)
    socket.on('user_leave_board', handleUserLeave)

    return () => {
      socket.off('user_join_board', handleUserJoin)
      socket.off('current_board_members', boardMemeber)
      socket.off('user_leave_board', handleUserLeave)
    }
  }, [dispatch, currentUser])

  const renderColor = generateColorConfigs()
  const findColor = renderColor.find((item) => item.background === board?.cover)

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

      columnService.update(columnId, { cardOrderIds: dndOrderedCardIds }).catch((err) => {
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
        .catch((err) => {
          console.error('❌ Failed to move card:', err)
        })
    },
    [board, dispatch]
  )

  if (!board) {
    return <LoadingSpiner caption="Loading board..." />
  }

  return (
    <Container disableGutters sx={{ height: '100vh' }} maxWidth={false}>
      {isShowModalActiveCard && <ActiveCard />}
      <AppBar colorConfigs={findColor} />
      <BoardBar board={board} colorConfigs={findColor} />
      <BoardContent
        colorConfigs={findColor}
        board={board}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
