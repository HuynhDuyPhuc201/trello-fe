

export const API_ROOT = import.meta.env.VITE_BUILD_MODE === 'dev'
  ? 'http://localhost:8017'
  : 'https://trello-be-5eyb.onrender.com';