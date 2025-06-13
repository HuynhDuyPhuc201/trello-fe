import axios from 'axios'
import { toast } from 'react-toastify'
import { API_ROOT } from '~/config/constants'
import { getToken, setToken } from '~/config/token'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { userService } from '~/services/user.service'
import { interceptorLoadingElements } from '~/utils/formatters'

// để sử dụng store redux trong file mà không phải là component
// Inject store là kỹ thuật khi sử dụng biến redux store ở các file ngoài phạm vi component
// https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
let reduxStore
export const injectStore = (store) => (reduxStore = store)

// Khởi tạo Axios instance
const api = axios.create({
  baseURL: API_ROOT,
  timeout: 1000 * 60 * 10,
  withCredentials: true // ✅ Đảm bảo luôn gửi cookie trong request
})

api.interceptors.request.use(
  (config) => {
    // kỹ thuật chặn spam click
    interceptorLoadingElements(true)
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token.accessToken}`
    }
    return config
  },
  async (error) => {
    return Promise.reject(error)
  }
)

// để chạy refresh token 1 lần mà không bị chạy lại request api dư thừa
let refreshTokenPromise = null
api.interceptors.response.use(
  (res) => {
    interceptorLoadingElements(false)
    return res.data
  },
  async (error) => {
    interceptorLoadingElements(false)

    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }

    toast.error(errorMessage)

    hanldeRefreshToken(error)

    return Promise.reject(error)
  }
)

const hanldeRefreshToken = async (error) => {
  const originalRequest = error.config

  if (!import.meta.env.VITE_COOKIE_MODE) {
    if (error?.response?.data?.message === 'Token is not valid') {
      try {
        // Gọi API refresh token
        const token = getToken()
        console.log('token', token)
        const newAccessToken = await userService.refreshToken(token.refreshToken)
        console.log('newAccessToken', newAccessToken)

        // Lưu token mới vào localStorage hoặc cookie
        setToken(newAccessToken.accessToken)

        // Cập nhật token mới vào headers của axios
        api.defaults.headers.Authorization = `Bearer ${newAccessToken.accessToken}`

        // Gửi lại request ban đầu với token mới
        error.config.headers.Authorization = `Bearer ${newAccessToken.accessToken}`
        return api.request(error.config)
      } catch (refreshError) {
        toast.error(refreshError?.response?.data?.message || 'Refresh token failed')
        reduxStore.dispatch(logoutUserAPI(false))
      }
    }
  } else {
    // https://www.thedutchlab.com/inzichten/using-axios-interceptors-for-refreshing-your-api-token
    if (error.response?.data.statusCode === 410 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        if (!refreshTokenPromise) {
          refreshTokenPromise = userService.refreshToken()
        }
        await refreshTokenPromise
        return api(originalRequest)
      } catch (error) {
        reduxStore.dispatch(logoutUserAPI(false))
      } finally {
        refreshTokenPromise = null
      }
    }

    if (error.response?.status === 401) {
      reduxStore.dispatch(logoutUserAPI(false))
    }
  }
}

export default api
