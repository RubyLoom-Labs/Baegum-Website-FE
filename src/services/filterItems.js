import api from './api'

export const getItems = async (endpoint) => {
  const response = await api.get(endpoint)
  return response;
}
