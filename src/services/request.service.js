import api from '~/apis/api'

const ENDPOINT = '/v1/request-join'

export const requestService = {
  async get(boardId) {
    const res = await api.get(`${ENDPOINT}`, {
      params: { boardId }
    })
    return res
  },

  async create(data) {
    const res = await api.post(`${ENDPOINT}`, data)
    return res
  },

  async update(data) {
    const res = await api.put(`${ENDPOINT}`, data)
    return res
  },
}
