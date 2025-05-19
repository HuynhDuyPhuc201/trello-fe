export const API_ROOT =
  import.meta.env.VITE_BUILD_MODE === 'dev' ? 'http://localhost:8017' : 'https://trello-be-5eyb.onrender.com'

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12
