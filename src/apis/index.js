import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// Khởi tạo Axios instance
const api = axios.create({
  baseURL: API_ROOT,
  withCredentials: true, // ✅ Đảm bảo luôn gửi cookie trong request
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor: Gửi token trong header nếu có (nếu lưu access token vào cookie thì không cần gửi token trong header)
api.interceptors.request.use((config) => {
  return config
})

api.interceptors.response.use(
  (res) => {
    return res.data
  },
  async (err) => {
    return Promise.reject(err)
  }
)

export default api
