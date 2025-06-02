import { useSelector } from 'react-redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '~/services/user.service'
import { toast } from 'react-toastify'

const initialState = {
  currentUser: null,
  error: null
}

export const loginUserAPI = createAsyncThunk('user/loginUserAPI', async (data, thunkAPI) => {
  try {
    const response = await userService.login(data)
    const { accessToken, refreshToken, ...rest } = response
    return response
  } catch (error) {
    // Trả về lỗi từ backend
    return thunkAPI.rejectWithValue(error?.response?.data || 'Login failed')
  }
})

export const logoutUserAPI = createAsyncThunk('user/logoutUserAPI', async (showMessage = true, thunkAPI) => {
  try {
    const res = await userService.logout()
    if (showMessage) toast.success('Logout successfully!')
    return res
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || 'Fetch board failed')
  }
})

export const updateUserAPI = createAsyncThunk('user/updateUserAPI', async (formData, thunkAPI) => {
  try {
    const res = await userService.update(formData)
    return res
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
      .addCase(logoutUserAPI.fulfilled, (state) => {
        state.currentUser = null
      })
      .addCase(updateUserAPI.fulfilled, (state, action) => {
        state.currentUser = action.payload
      })
  }
})

export const { updateCurrentUser } = userSlice.actions
export const useUser = () => useSelector((state) => state.user)
export const userReducer = userSlice.reducer
