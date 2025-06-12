import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getBoardDetail, updateMemberBoardBar } from '~/redux/activeBoard/activeBoardSlice'
import { clearAndHideCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

const useBoardSocketEvents = (socket) => {
  const dispatch = useDispatch()

  const navigation = useNavigate()

  const handlers = useMemo(
    () => ({
      current_board_members: ({ members }) => dispatch(updateMemberBoardBar({ members, type: 'set' })),

      user_join_board: ({ boardId, user }) => {
        dispatch(updateMemberBoardBar({ user, type: 'join' }))
        dispatch(getBoardDetail(boardId))
      },

      user_leave_board: (leftUser) => dispatch(updateMemberBoardBar({ user: leftUser, type: 'leave' })),

      update_board: async (boardId) => {
        try {
          await dispatch(getBoardDetail(boardId)).unwrap()
        } catch (error) {
          if (error.message === 'Board not found') {
            return navigation('/')
          }
        }
      },

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
