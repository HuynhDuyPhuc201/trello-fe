import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { requestService } from '~/services/request.service'
import socket from '~/sockets'

const initialState = {
  joinRequests: [],
  loading: false,
  error: null
}

const ENDPOINT = 'boardJoinRequest'

// GET all join requests (pending...)
export const getJoinRequests = createAsyncThunk(`${ENDPOINT}/getJoinRequests`, async (boardId, thunkAPI) => {
  try {
    const response = await requestService.get(boardId)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || 'Failed to fetch join requests')
  }
})

// CREATE new join request
export const createJoinRequest = createAsyncThunk(`${ENDPOINT}/createJoinRequest`, async (data, thunkAPI) => {
  try {
    const response = await requestService.create(data)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || 'Failed to create join request')
  }
})

export const updateJoinRequest = createAsyncThunk(`${ENDPOINT}/updateJoinRequest`, async (data, thunkAPI) => {
  try {
    const response = await requestService.update(data)
    socket.emit('request_join_board', response)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || 'Failed to create join request')
  }
})

export const joinRequestSlice = createSlice({
  name: 'joinRequest',
  initialState,
  reducers: {
    addJoinRequest: (state, action) => {
      state.joinRequests.unshift(action.payload || {})
    },
    clearJoinRequests: (state) => {
      state.joinRequests = []
    }
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getJoinRequests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getJoinRequests.fulfilled, (state, action) => {
        state.loading = false
        state.joinRequests = action.payload
      })
      .addCase(getJoinRequests.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // CREATE
      .addCase(createJoinRequest.fulfilled, (state, action) => {
        state.joinRequests.unshift(action.payload)
      })
  }
})

// Actions và Selector
export const { clearJoinRequests, addJoinRequest } = joinRequestSlice.actions
export const useJoinRequests = () => useSelector((state) => state.joinRequest)
export const joinRequestReducer = joinRequestSlice.reducer
