import { toast } from 'react-toastify'
import api from '~/apis/api'

const ENDPOINT = '/v1/users'

export const userService = {
  async login(data) {
    const res = await api.post(`${ENDPOINT}/login`, data)
    return res
  },

  async loginGoogle(token) {
    const res = await api.post(`${ENDPOINT}/login-google`, token)
    return res
  },

  async logout() {
    return await api.delete(`${ENDPOINT}/logout`)
  },

  async refreshToken(token) {
    return await api.get(`${ENDPOINT}/refresh-token`, token)
  },

  async register(data) {
    const res = await api.post(`${ENDPOINT}/register`, data)
    toast.success('Register successfully!')
    return res
  },

  async update(formData) {
    const res = await api.put(`${ENDPOINT}/update`, formData)
    toast.success('Update account successfully!')
    return res
  },

  async verifyEmail(data) {
    const res = await api.put(`${ENDPOINT}/verify`, data)
    toast.success('Account verified successfully!')
    return res
  }
}
