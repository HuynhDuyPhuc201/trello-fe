import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// Boards
export const fetchBoardDetailApi = async (boardId) => {
  const res = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Lưu ý: axios sẽ trả kết quả về qua property của nó là data

  return res.data
}

export const updateBoardDetailApi = async (boardId, updateData) => {
  const res = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)

  return res.data
}

export const moveCardToDifferentColumnApi = async (updateData) => {
  const res = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)

  return res.data
}

// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const res = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return res.data
}

export const updateColumnDetailApi = async (columnId, updateData) => {
  const res = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return res.data
}

export const deleteColumnDetailApi = async (columnId) => {
  const res = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return res.data
}

// Cards
export const createNewCardAPI = async (newCardData) => {
  const res = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  // Lưu ý: axios sẽ trả kết quả về qua property của nó là data

  return res.data
}
