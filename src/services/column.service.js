import api from '~/config/api'

export const columnService = {
  async createNewColumn(newColumnData) {
    return await api.post('/v1/columns', newColumnData)
  },

  async updateColumnDetail(columnId, updateData) {
    return await api.put(`/v1/columns/${columnId}`, updateData)
  },

  async deleteColumnDetail(columnId) {
    return await api.delete(`/v1/columns/${columnId}`)
  }
}
