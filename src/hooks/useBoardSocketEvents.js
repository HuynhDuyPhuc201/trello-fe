import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { getBoardDetail, updateMemberBoardBar } from '~/redux/activeBoard/activeBoardSlice'
import { clearAndHideCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

const useBoardSocketEvents = (socket) => {
  const dispatch = useDispatch()

  const handlers = useMemo(
    () => ({
      current_board_members: ({ members }) => dispatch(updateMemberBoardBar({ members, type: 'set' })),

      user_join_board: (newUser) => dispatch(updateMemberBoardBar({ user: newUser, type: 'join' })),

      user_leave_board: (leftUser) => dispatch(updateMemberBoardBar({ user: leftUser, type: 'leave' })),

      create_column: (column) => dispatch(getBoardDetail(column.boardId)),

      delete_column: (boardId) => dispatch(getBoardDetail(boardId)),

      update_column: (boardId) => dispatch(getBoardDetail(boardId)),

      create_card: (boardId) => dispatch(getBoardDetail(boardId)),

      update_card: (boardId) => dispatch(getBoardDetail(boardId)),

      delete_card: (boardId) => dispatch(getBoardDetail(boardId), dispatch(clearAndHideCurrentActiveCard()))
    }),
    [dispatch]
  )

  useEffect(() => {
    const events = Object.entries(handlers)

    events.forEach(([event, handler]) => {
      socket.on(event, handler)
    })

    return () => {
      events.forEach(([event, handler]) => {
        socket.off(event, handler)
      })
    }
  }, [socket, handlers])
}

export default useBoardSocketEvents
