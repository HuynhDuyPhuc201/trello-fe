import { io } from 'socket.io-client'
import { API_ROOT } from '~/config/constants'

const socket = io(API_ROOT)

export default socket
