import api from '~/apis/api'

export const cardService = {
  async create(newCardData) {
    return await api.post('/v1/cards', newCardData)
  },

  async update (cardId, updateData) {
    return await api.put(`/v1/cards/${cardId}`, updateData)
  }
}
