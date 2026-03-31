import api from './api'

export const getProducts = async (page) => {
  const response = await api.get(`/api/products?page=${page}`)
  return response;
}
