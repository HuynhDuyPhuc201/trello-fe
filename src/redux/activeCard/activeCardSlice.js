import { useSelector } from 'react-redux'
import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false,
  error: null
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    showModalActiveCard: (state, action) => {
      state.isShowModalActiveCard = action.payload
    },

    clearAndHideCurrentActiveCard: (state, action) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    },

    updateCurrentActiveCard: (state, action) => {
      state.currentActiveCard = action.payload
    }
  }
})

export const { showModalActiveCard, clearAndHideCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions
export const useActiveCard = () => useSelector((state) => state.activeCard)
// ✅ Custom hook để lấy comments của Card
// Trong slice hoặc selector file
export const useCardTitle = () => useSelector((state) => state.activeCard.currentActiveCard.title)

export const useCardDescription = () => useSelector((state) => state.activeCard.currentActiveCard.description)

export const useCardComment = () => useSelector((state) => state.activeCard.currentActiveCard.comments)

export const activeCardReducer = activeCardSlice.reducer
