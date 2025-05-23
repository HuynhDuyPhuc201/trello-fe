import api from '~/apis/api'

const ENDPOINT = '/v1/cards'

export const cardService = {
  async create(newCardData) {
    return await api.post(ENDPOINT, newCardData)
  },

  async update(cardId, updateData) {
    return await api.put(`${ENDPOINT}/${cardId}`, updateData)
  }
}
