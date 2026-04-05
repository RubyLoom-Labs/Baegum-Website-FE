import api from './api'

export const getProducts = async (page, product_category_id, filters = {}) => {
  const params = new URLSearchParams()
  params.append('page', page)
  params.append('product_category_id', product_category_id)

  Object.keys(filters).forEach(key => {
    if (Array.isArray(filters[key])) {
      filters[key].forEach(value => {
        params.append(`${key}[]`, value)
      })
    } else {
      params.append(key, filters[key])
    }
  })

  const response = await api.get(`/api/products?${params.toString()}`)
  return response;
}
