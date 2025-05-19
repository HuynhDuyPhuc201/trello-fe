import { useSelector } from 'react-redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { boardService } from '~/services/board.service'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
const initialState = {
  currentActiveBoard: null,
  error: null
}

// dùng middleware thunk thì phải đi kèm với extraReducers
export const getBoardDetail = createAsyncThunk(
  'activeboard/getBoardDetail',
  async (boardId, thunkAPI) => {
    try {
      const board = await boardService.getBoardDetail(boardId)
      // Sắp xếp columns
      // (video 71 đã giải thích lí do ở phần fix bug quan trọng)
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      // Duyệt qua từng column
      board.columns.forEach((column) => {
        if (isEmpty(column?.cards)) {
          const placeholder = generatePlaceholderCard(column)
          column.cards = [placeholder]
          column.cardOrderIds = [placeholder._id]
        } else {
          // sắp xếp  thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
          // (video 71 đã giải thích lí do ở phần fix bug quan trọng)
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      return board
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || 'Fetch board failed')
    }
  }
)

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      state.currentActiveBoard = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBoardDetail.fulfilled, (state, action) => {
        state.currentActiveBoard = action.payload
      })
      .addCase(getBoardDetail.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { updateCurrentActiveBoard } = activeBoardSlice.actions
export const useActiveBoard = () => useSelector((state) => state.activeBoard)
export const activeBoardReducer = activeBoardSlice.reducer
