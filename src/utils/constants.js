let apiRoot = ''

if (import.meta.env.MODE === 'development') {
  apiRoot = 'http://localhost:8017'
}
if (import.meta.env.MODE === 'production') {
  apiRoot = 'https://trello-be-5eyb.onrender.com'
}

export const API_ROOT = apiRoot
