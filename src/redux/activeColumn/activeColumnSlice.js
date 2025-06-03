// import { useSelector } from 'react-redux'
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { cardService } from '~/services/card.service'
// import { columnService } from '~/services/column.service'

// const initialState = {
//   currentActiveCard: null,
//   isShowModalActiveCard: false,
//   error: null
// }

// export const getColumn = createAsyncThunk('activeColumn/getColumn', async (columnId, thunkAPI) => {
//   try {
//     const result = await columnService.get(columnId)
//     return result
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error?.response?.data || 'Get column failed')
//   }
// })

// export const activeCardSlice = createSlice({
//   name: 'activeCard',
//   initialState,
//   reducers: {
//     showModalActiveCard: (state, action) => {
//       state.isShowModalActiveCard = action.payload
//     },

//     clearAndHideCurrentActiveCard: (state) => {
//       state.currentActiveCard = null
//       state.isShowModalActiveCard = false
//     },

//     updateCurrentActiveCard: (state, action) => {
//       state.currentActiveCard = action.payload
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(deleteCard.pending, (state) => {
//         state.error = null
//       })
//       .addCase(deleteCard.fulfilled, (state, action) => {
//         // Xoá xong thì clear
//         state.currentActiveCard = null
//         state.isShowModalActiveCard = false
//         state.error = null
//       })
//       .addCase(deleteCard.rejected, (state, action) => {
//         state.error = action.payload
//       })
//   }
// })

// export const { showModalActiveCard, clearAndHideCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

// export const useActiveCard = () => useSelector((state) => state.activeCard)
// export const activeCardReducer = activeCardSlice.reducer
