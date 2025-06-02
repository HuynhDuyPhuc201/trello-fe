import api from '~/apis/api'

const ENDPOINT = '/v1/cards'

export const cardService = {
  async create(newCardData) {
    return await api.post(`${ENDPOINT}/create/`, newCardData)
  },

  async template(templateCardData) {
    return await api.post(`${ENDPOINT}/template/`, templateCardData)
  },

  async update(cardId, updateData) {
    return await api.put(`${ENDPOINT}/update/${cardId}`, updateData)
  },

  async delete(cardId) {
    return await api.put(`${ENDPOINT}/delete/${cardId}`)
  }
}
