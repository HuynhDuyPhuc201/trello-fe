import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

const initialState = {
  currentActiveBoard: null
}

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      const fullBoard = action.payload
      // xử lý dữ liệu...

      // update lại dữ liệu
      state.currentActiveBoard = fullBoard
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard } = activeBoardSlice.actions
export const useActiveBoard = () => useSelector((state) => state.activeBoard)
export const activeBoardReducer = activeBoardSlice.reducer
