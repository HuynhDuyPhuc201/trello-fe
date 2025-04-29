import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import AppBar from '~/components/AppBar/AppBar'
import { useEffect, useState } from 'react'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { Box, CircularProgress, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { boardService } from '~/services/board.service'
import { columnService } from '~/services/column.service'
import { cardService } from '~/services/card.service'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // tạm thời fix cứng
    const boardId = '680c5df4dd56a0e4942ecc33'
    // Call api
    boardService.fetchBoardDetail(boardId).then((board) => {
      // sắp xếp  thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
      // (video 71 đã giải thích lí do ở phần fix bug quan trọng)
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach((column) => {
        // Khi F5 trang web thì cần xử lý vấn đề kéo thả vào một column rỗng (Nhớ lại video 37.2, hiện tại là 69)

        if (isEmpty(column?.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // sắp xếp  thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
          // (video 71 đã giải thích lí do ở phần fix bug quan trọng)
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
  }, [])

  // console.log('board', board)

  // func này có nhiệm vụ gọi API tạo mới Column và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await columnService.createNewColumn({
      ...newColumnData,
      boardId: board._id
    })

    // Khi tạo column mới thì nó sẽ chưa có card, cần xử lý vấn đề kéo thả vào một column rỗng ( nhớ lại video 37.2 - hiện tại là video 69)
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // cập nhật state board
    // Phía FE chúng ta phải tự làm đúng lại state data board (thay vì phải gọi lại api fetchBoardDetail)
    // Lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn toàn bộ Board dù
    // đây có là api tạo Column hay Card đi chăng nữa => lúc này thì FE sẽ nhàn hơn
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // func này có nhiệm vụ gọi API tạo mới column và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await cardService.createNewCard({
      ...newCardData,
      boardId: board._id
    })
    console.log('createdCard', createdCard)

    // cập nhật state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find((column) => column._id === createdCard.columnId)
    if (columnToUpdate) {
      // nếu Column rỗng: bản chất là đang chứa một cái Placeholder card (Nhớ lại video 37.2, hiện tại là video 69)

      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        console.log('code vào if')

        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        // Ngược lại column đã có data thì push vào cuối mảng

        console.log('code vào else')
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    console.log('columnToUpdate: ', columnToUpdate)
    setBoard(newBoard)
  }

  // func này có nhiệm vụ gọi API và xử lý khi kéo thả Column xong xuôi
  // Chỉ cần gọi API để cập nhật mảng columnOrderIds của Column chứa nó (thay đổi vị trí trong mảng)

  const moveColumns = (dndOderedColumns) => {
    // Update lại cho chuẩn dữ liệu state Board
    const dndOderedColumnsIds = dndOderedColumns.map((c) => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOderedColumns
    newBoard.columnOrderIds = dndOderedColumnsIds
    setBoard(newBoard)

    // Gọi API update board
    boardService.updateBoardDetail(newBoard._id, { columnOrderIds: dndOderedColumnsIds })
  }

  // Khi di chuyển card trong cùng column:
  // Chỉ cần gọi API để cập nhật mảng cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
  const moveCardInTheSameColumn = (dndOderedCards, dndOderedCardIds, columnId) => {
    // update cho chuẩn dữ liệu State Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOderedCards
      columnToUpdate.cardOrderIds = dndOderedCardIds
    }
    setBoard(newBoard)

    // gọi API update Column
    columnService.updateColumnDetail(columnId, { cardOrderIds: dndOderedCardIds })
  }

  // Khi di chuyển Card sang Column khác:
  // B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (hiểu bản chất là xóa đi _id của Card ra khỏi mảng)
  // B2: Cập nhật mảng cardOrderIds của Column tiếp theo (hiểu bản chất là thêm _id của Card vào mảng)
  // B3: Cập nhật lại trường columnId mới của cái card đã kéo
  // => làm một API support riêng

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOderedColumns) => {
    // Update lại cho chuẩn dữ liệu state Board
    const dndOderedColumnsIds = dndOderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOderedColumns
    newBoard.columnOrderIds = dndOderedColumnsIds
    setBoard(newBoard)

    // Gọi API xử lý phía BE

    let prevCardOrderIds = dndOderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds
    // xử lý vấn đề khi kéo Card cuối cùng ra khỏi Column, Column rỗng sẽ có placeholder card
    // cần xóa nó đi trước khi gửi dữ liệu lên cho phía BE (nhớ lại video 37.2)
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    boardService.moveCardToDifferentColumn({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds
    })
  }

  // xử lý xóa 1 Column và Cards bên trong nó
  const deleteColumnDetails = (columnId) => {
    // update cho chuẩn dữ liệu State board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter((_id) => _id !== columnId)
    setBoard(newBoard)

    // gọi API xử lý phía BE

    columnService.deleteColumnDetail(columnId).then((res) => {
      toast.success(res?.deleteResult)
    })
  }

  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }
  return (
    <Container disableGutters sx={{ height: '100vh' }} maxWidth={false}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board
