import api from './api'

export const getBrands = async (page = 1, limit = 12, filters = {}) => {
  const params = new URLSearchParams()
  params.append('page', page)
  params.append('limit', limit)

  Object.keys(filters).forEach(key => {
    if (Array.isArray(filters[key])) {
      filters[key].forEach(value => {
        params.append(`${key}[]`, value)
      })
    } else {
      params.append(key, filters[key])
    }
  })

  const response = await api.get(`/api/brands?${params.toString()}`)
  return response
}
