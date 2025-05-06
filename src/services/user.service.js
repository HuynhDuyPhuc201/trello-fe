import { toast } from 'react-toastify'
import api from '~/apis/api'

export const userService = {
  async login(data) {
    const res = await api.post(`/v1/users/login`, data)
    toast.success('Login successfully!')
    return res
  },

  async register(data) {
    const res = await api.post(`/v1/users/register`, data)
    toast.success('Register successfully!')
    return res
  },

  async verifyEmail(data) {
    const res = await api.put(`/v1/users/verify`, data)
    toast.success('Account verified successfully!')
    return res
  },
}
