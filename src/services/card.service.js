import api from '~/apis'

export const cardService = {
  async createNewCard(newCardData) {
    return await api.post('/v1/cards', newCardData)
  }
}
