import { toast } from 'react-toastify'
import api from '~/apis/api'

export const userService = {
  async login(data) {
    const res = await api.post(`/v1/users/login`, data)
    toast.success('Login successfully!')
    return res
  },

  async logout() {
    return await api.delete(`/v1/users/logout`)
  },

  async refreshToken(data) {
    return await api.get(`/v1/users/refresh-token`, data)
  },

  async register(data) {
    const res = await api.post(`/v1/users/register`, data)
    toast.success('Register successfully!')
    return res
  },

  async update(form) {
    const res = await api.put(`/v1/users/update`, form)
    toast.success('Update successfully!')
    return res
  },

  async verifyEmail(data) {
    const res = await api.put(`/v1/users/verify`, data)
    toast.success('Account verified successfully!')
    return res
  }
}
