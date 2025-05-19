import api from '~/apis/api'

export const columnService = {
  async create(newColumnData) {
    return await api.post('/v1/columns', newColumnData)
  },
  async update(columnId, updateData) {
    return await api.put(`/v1/columns/${columnId}`, updateData)
  },
  async delete(columnId) {
    return await api.delete(`/v1/columns/${columnId}`)
  }
}
