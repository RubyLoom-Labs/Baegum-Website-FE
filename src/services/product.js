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

export const getProductDetail = async (id) => {
  const response = await api.get(`/api/products/${id}`)
  return response;
}

export const getProductVariantDetail = async (variantId) => {
  const response = await api.get(`/api/product-variants/${variantId}`)
  return response;
}

export const submitProductReview = async (reviewData) => {
  const formData = new FormData();
  formData.append('product_id', reviewData.product_id);
  formData.append('order_id', reviewData.order_id);
  formData.append('rating', reviewData.rating);
  formData.append('review', reviewData.review);

  // Add photos if any
  if (reviewData.photos && reviewData.photos.length > 0) {
    reviewData.photos.forEach((photo, index) => {
      formData.append(`photos[${index}]`, photo);
    });
  }

  // Log the payload being sent (for debugging)
  console.log('📤 Submitting review to /api/reviews with FormData:', {
    product_id: reviewData.product_id,
    order_id: reviewData.order_id,
    rating: reviewData.rating,
    review: reviewData.review,
    photo_count: reviewData.photos?.length || 0
  });

  // Use postFormData for multipart/form-data uploads
  const response = await api.postFormData('/api/reviews', formData);
  return response;
}

export const getProductReviews = async (productId) => {
  const response = await api.get(`/api/reviews/product/${productId}`);
  return response;
}

export const getOrderReviews = async (orderId) => {
  const response = await api.get(`/api/reviews/order/${orderId}`);
  return response;
}
