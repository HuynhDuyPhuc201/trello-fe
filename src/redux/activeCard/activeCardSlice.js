import { useSelector } from 'react-redux'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { cardService } from '~/services/card.service'

const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false,
  error: null
}

export const deleteCard = createAsyncThunk('activeCard/deleteCard', async (cardId, thunkAPI) => {
  try {
    const result = await cardService.delete(cardId)
    return result
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || 'Delete card failed')
  }
})

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    showModalActiveCard: (state, action) => {
      state.isShowModalActiveCard = action.payload
    },

    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    },

    updateCurrentActiveCard: (state, action) => {
      state.currentActiveCard = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteCard.pending, (state) => {
        state.error = null
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        // Xoá xong thì clear
        state.currentActiveCard = null
        state.isShowModalActiveCard = false
        state.error = null
      })
      .addCase(deleteCard.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { showModalActiveCard, clearAndHideCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

export const useActiveCard = () => useSelector((state) => state.activeCard)

export const useCardTitle = () => useSelector((state) => state.activeCard.currentActiveCard?.title)

export const useCardDescription = () => useSelector((state) => state.activeCard.currentActiveCard?.description)

export const useCardComment = () => useSelector((state) => state.activeCard.currentActiveCard?.comments)

export const activeCardReducer = activeCardSlice.reducer
