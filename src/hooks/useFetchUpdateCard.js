import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { getBoardDetail } from '~/redux/activeBoard/activeBoardSlice'
import { updateCurrentActiveCard, useActiveCard } from '~/redux/activeCard/activeCardSlice'
import { cardService } from '~/services/card.service'

export const useFetchUpdateCard = () => {
  const dispatch = useDispatch()
  const { currentActiveCard } = useActiveCard()

  const fetchUpdateCard = useCallback(
    async (updateData) => {
      try {
        const updatedCard = await cardService.update(currentActiveCard._id, updateData)
        if (updatedCard) {
          dispatch(updateCurrentActiveCard(updatedCard))
          dispatch(getBoardDetail(updatedCard.boardId))
        }
        return { success: true, updatedCard }
      } catch (error) {
        toast.error('Failed to update card. Please try again.')
        return { success: false, error }
      }
    },
    [currentActiveCard._id, dispatch]
  )

  return { fetchUpdateCard }
}
