export const API_ROOT =
  import.meta.env.VITE_BUILD_MODE === 'dev' ? 'http://localhost:8017' : 'https://trello-be-5eyb.onrender.com'

export const API_ROOT_FE =
  import.meta.env.VITE_BUILD_MODE === 'dev' ? 'http://localhost:3000' : 'https://hdphuc-trello.vercel.app'

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const COLORS = ['#4CCB9E', '#F1C94C', '#F5A25D', '#F06A65', '#A293F1', '#A3C943', '#DC84C5', '#8A94A6 ']

export const unsplashSamples = [
  'https://images.unsplash.com/photo-1506765515384-028b60a970df',
  'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1504941214544-9c1c44559ab4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
]

export const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}
export const INVITATION_TYPES = {
  BOARD_INVITATION: 'BOARD_INVITATION',
  BOARD_REQUEST_JOIN: 'BOARD_REQUEST_JOIN'
}

export const CARD_MEMBER_ACTION = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}

export const imageAvatar = (user) => {
  if (typeof user.avatar === 'string') {
    return user.avatar
  }
  return `${API_ROOT}/uploads/avatar/${user?.avatar?.filename}`
}
export const imageAttach = (file) => {
  return `${API_ROOT}/uploads/attachs/${file?.filename}`
}

export const imageCards = (file) => {
  return `${API_ROOT}/uploads/cards/${file?.cover?.filename}`
}
