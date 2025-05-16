import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import AppBar from '~/components/AppBar/AppBar'
import { useEffect } from 'react'
import { boardService } from '~/services/board.service'
import { columnService } from '~/services/column.service'
import { useDispatch } from 'react-redux'
import { fetchBoardDetail, updateCurrentActiveBoard, useActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { cloneDeep } from 'lodash'
import LoadingSpiner from '~/components/Loading/Loading'

function Board() {
  const dispatch = useDispatch()
  const { currentActiveBoard } = useActiveBoard()
  const board = currentActiveBoard

  useEffect(() => {
    const boardId = '680c5df4dd56a0e4942ecc33'
    dispatch(fetchBoardDetail(boardId))
  }, [dispatch])

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
      .updateBoardDetail(newBoard._id, {
        columnOrderIds: dndOrderedColumnIds
      })
      .catch((err) => {
        console.error('Failed to update column order:', err)
        // Optional: dispatch rollback nếu cần
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

    columnService.updateColumnDetail(columnId, { cardOrderIds: dndOrderedCardIds }).catch((err) => {
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

  return (
    <Container disableGutters sx={{ height: '100vh' }} maxWidth={false}>
      <AppBar />
      <BoardBar board={board} />
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
