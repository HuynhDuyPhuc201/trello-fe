// Redux
import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'


// https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
// https://www.npmjs.com/package/redux-persist
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { activeCardReducer } from './activeCard/activeCardSlice'
import { notificationReducer } from './notifications/notificationsSlice'


const persistConfig = {
  key: 'root', // key cái persist do chúng ta chỉ định, mặc định là root
  storage, // storage là cái storage do chúng ta sử dụng, mặc định là localStorage
  whitelist: ['user'] // định nghĩa các các slice dữ liệu ĐƯỢC PHÉP duy trì qua mỗi lần F5 trình duyệt
  // blacklist: ['user'] // định nghĩa các các slice dữ liệu KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần F5 trình duyệt
}

const rootReducer = combineReducers({
  activeBoard: activeBoardReducer,
  activeCard: activeCardReducer,
  user: userReducer,
  notifications: notificationReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// https://www.youtube.com/watch?v=qa6rG-w83Nc&t=4226s
export const store = configureStore({
  reducer: persistedReducer,
  // fix warning error when using redux-persist
  // https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using/63244831#63244831
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
