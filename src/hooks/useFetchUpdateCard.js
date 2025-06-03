import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { getBoardDetail } from '~/redux/activeBoard/activeBoardSlice'
import { updateCurrentActiveCard, useActiveCard } from '~/redux/activeCard/activeCardSlice'
import { cardService } from '~/services/card.service'
import socket from '~/sockets'

// Thêm ={} làm mặc định cho params truyền vào hook:
export const useFetchUpdateCard = ({ fetchDetail = true } = {}) => {
  const dispatch = useDispatch()
  const { currentActiveCard } = useActiveCard()
  const fetchUpdateCard = useCallback(
    async (updateData) => {
      try {
        const updatedCard = await cardService.update(currentActiveCard._id, updateData)
        if (updatedCard) {
          dispatch(updateCurrentActiveCard(updatedCard))
          socket.emit('update_activeCard', updatedCard)
          // phòng 1 vài TH không cần fetch lại detail
          if (fetchDetail) {
            dispatch(getBoardDetail(updatedCard.boardId)).unwrap()
          }
          socket.emit('update_card', updatedCard.boardId)
        }
        return { success: true, updatedCard }
      } catch (error) {
        toast.error('Failed to update card. Please try again.')
        return { success: false, error }
      }
    },
    [currentActiveCard._id, dispatch, fetchDetail]
  )

  return { fetchUpdateCard }
}
