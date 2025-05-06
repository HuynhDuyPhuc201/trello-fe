// Redux
import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'

export default configureStore({
  reducer: {
    activeBoard: activeBoardReducer,
    user: userReducer
  }
})
