import { toast } from 'react-toastify'
import api from '~/apis/api'

export const boardService = {
  async create(data) {
    const res = await api.post(`/v1/boards`, data)
    toast.success('Create board successfully!')
    return res
  },

  async getAll(query) {
    return await api.get(`/v1/boards${query ? `${query}` : ''}`)
  },

  async getDetails(boardId) {
    return await api.get(`/v1/boards/${boardId}`)
  },

  async update(boardId, updateData) {
    return await api.put(`/v1/boards/${boardId}`, updateData)
  },

  async moveCardToDifferentColumn(updateData) {
    return await api.put('/v1/boards/supports/moving_card', updateData)
  }
}
