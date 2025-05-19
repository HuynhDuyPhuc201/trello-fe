import { useSelector } from 'react-redux'
import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  currentActiveCard: null,
  error: null
}

export const activeCardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  reducers: {
    clearCurrentActiveCard: (state, action) => {
      state.currentActiveCard = action.payload
    },

    updateCurrentActiveCard: (state, action) => {
      state.currentActiveCard = action.payload
    }
  }
})

export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions
export const useActiveCard = () => useSelector((state) => state.activeCard)
export const activeCardReducer = activeCardSlice.reducer
