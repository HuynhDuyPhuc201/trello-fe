import { toast } from 'react-toastify'
import api from '~/apis/api'

export const boardService = {
  async createBoard(data) {
    const res = await api.post(`/v1/boards`, data)
    toast.success('Create board successfully!')
    return res
  },

  async getBoards(query) {
    return await api.get(`/v1/boards${query ? `${query}` : ''}`)
  },

  async getBoardDetail(boardId) {
    return await api.get(`/v1/boards/${boardId}`)
  },

  async updateBoardDetail(boardId, updateData) {
    return await api.put(`/v1/boards/${boardId}`, updateData)
  },

  async moveCardToDifferentColumn(updateData) {
    return await api.put('/v1/boards/supports/moving_card', updateData)
  }
}
