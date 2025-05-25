export const API_ROOT =
  import.meta.env.VITE_BUILD_MODE === 'dev' ? 'http://localhost:8017' : 'https://trello-be-5eyb.onrender.com'

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const COLORS = ['#4CCB9E', '#F1C94C', '#F5A25D', '#F06A65', '#A293F1', '#A3C943', '#DC84C5', '#8A94A6 ']

export const unsplashSamples = [
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
  "https://images.unsplash.com/photo-1522199755839-a2bacb67c546",
  "https://images.unsplash.com/photo-1506765515384-028b60a970df",
  "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
  "https://images.unsplash.com/photo-1485217988980-11786ced9454"
]

export const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}