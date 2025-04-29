import api from '~/apis'

export const boardService = {
  async fetchBoardDetail(boardId) {
    return await api.get(`/v1/boards/${boardId}`)
  },

  async updateBoardDetail(boardId, updateData) {
    return await api.put(`/v1/boards/${boardId}`, updateData)
  },

  async moveCardToDifferentColumn(updateData) {
    return await api.put('/v1/boards/supports/moving_card', updateData)
  }
}
