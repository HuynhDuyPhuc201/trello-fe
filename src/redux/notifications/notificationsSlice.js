import { useSelector } from 'react-redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { inviteService } from '~/services/invite.service'

const initialState = {
  currentNotification: []
}

const ENDPOINT = 'boards'

export const getInvite = createAsyncThunk(`${ENDPOINT}/getInvite`, async (_, thunkAPI) => {
  try {
    const response = await inviteService.get()
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || 'Get invite failed')
  }
})

export const updateInvite = createAsyncThunk(`${ENDPOINT}/updateInvite`, async (data, thunkAPI) => {
  try {
    const res = await inviteService.update(data)
    return res
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || 'Update invite failed')
  }
})

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.currentNotification.unshift(action.payload || {})
    },
    updateNotification: (state, action) => {
      state.currentNotification = action.payload
    },
    clearNotification: (state, action) => {
      state.currentNotification = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInvite.fulfilled, (state, action) => {
        state.currentNotification = action.payload.reverse()
      })
      .addCase(updateInvite.fulfilled, (state, action) => {
        const item = action.payload
        // tìm ra index của item trong currentNotification
        // index !== -1 có nghĩa là item đã tồn tại trong mảng
        // sẽ xử lý khi trong trường hợp cập nhật accept hoặc reject
        const index = state.currentNotification.findIndex((notify) => notify._id === item._id)
        if (index !== -1) {
          state.currentNotification[index] = item
        } else {
          state.currentNotification.push(item) // Thêm mới nếu không tồn tại
        }
      })
  }
})

export const { addNotification, updateNotification, clearNotification } = notificationsSlice.actions
export const useNotification = () => useSelector((state) => state.notifications)
export const notificationReducer = notificationsSlice.reducer
