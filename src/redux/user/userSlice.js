import { useSelector } from 'react-redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '~/services/user.service'

const initialState = {
  currentUser: null,
  error: null
}

export const loginUserAPI = createAsyncThunk('user/loginUserAPI', async (data, thunkAPI) => {
  try {
    const response = await userService.login(data)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || 'Fetch board failed')
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateCurrentUser: (state, action) => {
      state.currentUser = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAPI.fulfilled, (state, action) => {
        state.currentUser = action.payload
      })
      .addCase(loginUserAPI.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { updateCurrentUser } = userSlice.actions
export const useUser = () => useSelector((state) => state.user)
export const userReducer = userSlice.reducer
