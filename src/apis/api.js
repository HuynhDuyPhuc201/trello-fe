import axios from 'axios'
import { toast } from 'react-toastify'
import { API_ROOT } from '~/config/constants'
import { interceptorLoadingElements } from '~/utils/formatters'

// Khởi tạo Axios instance
const api = axios.create({
  baseURL: API_ROOT,
  withCredentials: true, // ✅ Đảm bảo luôn gửi cookie trong request
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor: Gửi token trong header nếu có (nếu lưu access token vào cookie thì không cần gửi token trong header)
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

api.interceptors.response.use(
  (res) => {
    // kỹ thuật chặn spam click
    interceptorLoadingElements(false)
    return res.data
  },
  async (error) => {

// kỹ thuật chặn spam click
interceptorLoadingElements(false)


    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }

    // dùng toast để hiển thị thông báo tất cả lỗi trừ lỗi 401 (Unauthorized)
    // 401 là lỗi không có quyền truy cập, thường là do token hết hạn hoặc không có quyền truy cập vào API đó
    if (error.response?.status !== 401) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default api
