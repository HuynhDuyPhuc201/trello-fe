import { useSelector } from 'react-redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { boardService } from '~/services/board.service'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
const initialState = {
  currentActiveBoard: null,
  error: null,
  boards: [],
  memberBoardBar: []
}
// dùng middleware thunk thì phải đi kèm với extraReducers
export const getBoardDetail = createAsyncThunk('activeboard/getBoardDetail', async (boardId, thunkAPI) => {
  try {
    const board = await boardService.getDetails(boardId)
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
})

export const getBoardAll = createAsyncThunk('boards/getBoardAll', async (data, thunkAPI) => {
  try {
    const allBoards = await boardService.getAll(data)
    return allBoards
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || 'Fetch board failed')
  }
})

export const deleteBoard = createAsyncThunk('boards/deleteBoard', async (boardId, thunkAPI) => {
  try {
    const deletedBoard = await boardService.deleteBoard(boardId)
    return deletedBoard
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || 'Fetch board failed')
  }
})

export const updateBoard = createAsyncThunk('boards/updateBoard', async (updateData, thunkAPI) => {
  const { boardId } = updateData
  try {
    const deletedBoard = await boardService.update(boardId, updateData)
    return deletedBoard
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || 'Fetch board failed')
  }
})

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      state.currentActiveBoard = action.payload
    },
    updateCardInBoard: (state, action) => {
      const { cardId, updateData } = action.payload
      const cardIndex = state.currentActiveBoard.columns.findIndex((column) =>
        column.cards.some((card) => card._id === cardId)
      )
      if (cardIndex !== -1) {
        state.currentActiveBoard.columns[cardIndex].cards = state.currentActiveBoard.columns[cardIndex].cards.map(
          (card) => (card._id === cardId ? { ...card, ...updateData } : card)
        )
      }
    },
    updateBoards: (state, action) => {
      state.boards = action.payload
    },
    clearCurrentActiveBoard: (state) => {
      state.currentActiveBoard = null
      state.memberBoardBar = []
    },

    // member
    updateMemberBoardBar: (state, action) => {
      const { user, type, members } = action.payload
      if (type === 'join') {
        const existed = state.memberBoardBar.find((u) => u._id === user._id)
        if (!existed) {
          state.memberBoardBar.push(user)
        }
      }
      if (type === 'leave') {
        state.memberBoardBar = state.memberBoardBar.filter((u) => u._id !== user._id)
      }
      if (type === 'set' && members) {
        state.memberBoardBar = members
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBoardDetail.fulfilled, (state, action) => {
        state.currentActiveBoard = action.payload
        state.currentActiveBoard.allUsers = [...state.currentActiveBoard.owners, ...state.currentActiveBoard.members]
      })
      .addCase(getBoardAll.fulfilled, (state, action) => {
        state.boards = [action.payload.boards].flat()
        state.totalBoards = action.payload.total || 0
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = [action.payload.boards].flat()
        state.totalBoards = state.boards.length
      })
      .addCase(getBoardDetail.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        const updatedBoard = action.payload
        const index = state.boards.findIndex((b) => b._id === updatedBoard._id)

        if (index !== -1) {
          state.boards[index] = updatedBoard
        }

        // Nếu board đang được mở là cái đang update => cập nhật luôn
        if (state.currentActiveBoard?._id === updatedBoard._id) {
          state.currentActiveBoard = {
            ...state.currentActiveBoard,
            ...updatedBoard
          }
        }
      })
  }
})

export const {
  updateCurrentActiveBoard,
  updateCardInBoard,
  updateBoards,
  clearCurrentActiveBoard,
  updateMemberBoardBar
} = activeBoardSlice.actions
export const useActiveBoard = () => useSelector((state) => state.activeBoard)
export const activeBoardReducer = activeBoardSlice.reducer
