import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import AppBar from '~/components/AppBar/AppBar'
import { useEffect, useState, useCallback } from 'react'
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

  useEffect(() => {
    dispatch(getBoardDetail(boardId))
    dispatch(getBoardAll())

    return () => {
      dispatch(clearCurrentActiveBoard())
    }
  }, [dispatch, boardId])

  useEffect(() => {
    if (!board?._id) return

    const handleUserJoin = (newUser) => {
      toast.success(`${newUser.name || newUser.email} vừa tham gia board!`)
      dispatch(getBoardDetail(board._id))
    }

    const handleUserLeave = (newUser) => {
      toast.success(`${newUser.name || newUser.email} vừa rời khỏi board!`)
      dispatch(getBoardDetail(board._id))
    }

    socket.on('user_join_board', handleUserJoin)
    socket.on('user_leave_board', handleUserLeave)

    return () => {
      socket.off('user_join_board', handleUserJoin)
      socket.off('user_leave_board', handleUserLeave)
    }
  }, [board?._id, dispatch])

  useEffect(() => {
    return () => {
      if (boardId && currentUser) {
        socket.emit('user_leave_board', {
          boardId,
          user: {
            _id: currentUser._id,
            name: currentUser.name,
            email: currentUser.email
          }
        })
      }
    }
  }, [boardId, currentUser])

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
