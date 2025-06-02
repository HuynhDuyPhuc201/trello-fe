import { toast } from 'react-toastify'
import api from '~/apis/api'

const ENDPOINT = '/v1/invites'

export const inviteService = {
  async get() {
    const res = await api.get(`${ENDPOINT}`)
    return res
  },

  async update(data) {
    const { status, invitationId } = data
    const res = await api.put(`${ENDPOINT}/board/${invitationId}`, { status })
    return res
  },

  async deletInvite(inviteeId) {
    const res = await api.delete(`${ENDPOINT}/${inviteeId}`)
    return res
  },

  async inviteUserToBoard(data) {
    const res = await api.post(`${ENDPOINT}`, data)
    toast.success('Invite user to board successfully!')
    return res
  }
}
