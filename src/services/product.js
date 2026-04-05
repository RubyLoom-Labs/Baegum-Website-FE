import api from './api'

export const getProducts = async (page, product_category_id) => {
  const response = await api.get(`/api/products?page=${page}&product_category_id=${product_category_id}`)
  return response;
}
