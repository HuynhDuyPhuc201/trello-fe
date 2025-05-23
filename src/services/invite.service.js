import { toast } from 'react-toastify'
import api from '~/apis/api'

const ENDPOINT = '/v1/invites'

export const inviteService = {
  async inviteUserToBoard(data) {
    const res = await api.post(`${ENDPOINT}/board`, data)
    toast.success('Invite user to board successfully!')
    return res
  }
}
