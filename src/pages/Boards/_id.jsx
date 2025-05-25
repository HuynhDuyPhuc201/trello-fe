import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import AppBar from '~/components/AppBar/AppBar'
import { useEffect } from 'react'
import { boardService } from '~/services/board.service'
import { columnService } from '~/services/column.service'
import { useDispatch } from 'react-redux'
import {
  clearCurrentActiveBoard,
  getBoardDetail,
  updateCurrentActiveBoard,
  useActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { cloneDeep } from 'lodash'
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

  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map((col) => col._id)

    const newBoard = {
      ...board,
      columns: [...dndOrderedColumns],
      columnOrderIds: [...dndOrderedColumnIds]
    }

    dispatch(updateCurrentActiveBoard(newBoard))

    // Không cần await nếu không dùng loading, nhưng vẫn nên handle lỗi
    boardService
      .update(newBoard._id, {
        columnOrderIds: dndOrderedColumnIds
      })
      .catch((err) => {
        toast.error('Cập nhật thứ tự thất bại!', err)
      })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
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
      // Optional: rollback UI hoặc toast
    })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // B1: Tạo board mới với clone mảng để Redux nhận thay đổi
    const newBoard = {
      ...board,
      columns: [...dndOrderedColumns],
      columnOrderIds: dndOrderedColumns.map((col) => col._id)
    }

    dispatch(updateCurrentActiveBoard(newBoard))

    // B2: Lấy ra cardOrderIds của column cũ
    let prevCardOrderIds = dndOrderedColumns.find((col) => col._id === prevColumnId)?.cardOrderIds

    // B3: Nếu column cũ rỗng (chứa placeholder), bỏ luôn
    if (prevCardOrderIds?.[0]?.includes('placeholder-card')) {
      prevCardOrderIds = []
    }

    // B4: Gửi API cập nhật backend
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
  }

  if (!board) {
    return <LoadingSpiner caption="Loading board..." />
  }

  // if (!board) {
  //   return <Navigate to="/404" />
  // }

  return (
    <Container disableGutters sx={{ height: '100vh' }} maxWidth={false}>
      {/* Modal active check đóng mỏ dựa theo điều kiện có tồn tại data isShowModalActiveCard lưu trong Redux hay không thì mới render. Mỗi thời điểm chỉ tồn tải cái modal card dang active */}

      {isShowModalActiveCard && <ActiveCard />}
      {/* các phần còn lại của Board Details */}

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
