import api from '~/apis/api'

const ENDPOINT = '/v1/columns'

export const columnService = {
  async create(newColumnData) {
    return await api.post(ENDPOINT, newColumnData)
  },
  async update(columnId, updateData) {
    return await api.put(`${ENDPOINT}/${columnId}`, updateData)
  },
  async delete(columnId) {
    return await api.delete(`${ENDPOINT}/${columnId}`)
  },

  async moveColumn (columnId, newBoardId) {
    return api.put(`${ENDPOINT}/move/${columnId}`, { boardId: newBoardId });
  }
}
