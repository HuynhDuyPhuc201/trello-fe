import api from '~/config/api'

export const cardService = {
  async createNewCard(newCardData) {
    return await api.post('/v1/cards', newCardData)
  }
}
