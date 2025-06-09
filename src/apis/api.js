import axios from 'axios'
import { toast } from 'react-toastify'
import { API_ROOT } from '~/config/constants'
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

    console.log('error', error)
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }

    toast.error(errorMessage)

    const originalRequest = error.config

    // https://www.thedutchlab.com/inzichten/using-axios-interceptors-for-refreshing-your-api-token
    if (error.response?.data.statusCode === 410 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        if (!refreshTokenPromise) {
          refreshTokenPromise = await userService.refreshToken()
          // Chờ một chút để cookie cập nhật
          await new Promise((resolve) => setTimeout(resolve, 200))
        }
        // api.defaults.headers.Authorization = `Bearer ${refreshTokenPromise}`

        return api(originalRequest)
      } catch (error) {
        // bất kỳ lỗi nào liên quan đến việc refresh token thì logout user
        reduxStore.dispatch(logoutUserAPI(false))
      } finally {
        refreshTokenPromise = null
      }
    }
    // dùng toast để hiển thị thông báo tất cả lỗi trừ lỗi 401 (Unauthorized)
    // 401 là lỗi không có quyền truy cập, thường là do token hết hạn hoặc không có quyền truy cập vào API đó
    if (error.response?.status === 401) {
      reduxStore.dispatch(logoutUserAPI(false))
    }
    return Promise.reject(error)
  }
)

export default api
