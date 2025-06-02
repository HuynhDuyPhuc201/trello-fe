import { toast } from 'react-toastify'
import api from '~/apis/api'

const ENDPOINT = '/v1/boards'
export const boardService = {
  async create(data) {
    const res = await api.post(`${ENDPOINT}/create`, data)
    toast.success('Create board successfully!')
    return res
  },

  async getAll(query) {
    return await api.get(`${ENDPOINT}${query ? `${query}` : ''}`)
  },

  async getDetails(boardId) {
    return await api.get(`${ENDPOINT}/detail/${boardId}`)
  },

  async update(boardId, updateData) {
    return await api.put(`${ENDPOINT}/update/${boardId}`, updateData)
  },

  async deleteBoard(boardId) {
    return await api.delete(`${ENDPOINT}/delete/${boardId}`)
  },

  async moveCardToDifferentColumn(updateData) {
    return await api.put(`${ENDPOINT}/supports/moving_card`, updateData)
  }
}
