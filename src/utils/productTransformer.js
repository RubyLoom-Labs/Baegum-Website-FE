/**
 * Transform API product data to component-compatible format
 * @param {object} apiProduct - Raw product data from API
 * @returns {object} Transformed product data
 */
export const transformProductData = (apiProduct) => {
  if (!apiProduct || !apiProduct.data) {
    return null;
  }

  const product = apiProduct.data;

  // Extract images from photos array
  const images = product.photos && product.photos.length > 0
    ? product.photos.map(photo => photo.url || photo.path)
    : []; // Empty array if no photos

  // Group variants by criteria type to extract available options
  const variantsByType = {};
  const colorSet = new Set();
  const sizeSet = new Set();
  const colorMap = {}; // Map criteria_value_id to color info { id, name, hex }
  const sizeMap = {}; // Map criteria_value_id to size name

  if (product.product_variants && product.product_variants.length > 0) {
    product.product_variants.forEach((variant, idx) => {
      if (variant.criteria && variant.criteria.length > 0) {
        variant.criteria.forEach(criterion => {
          const criteriaType = criterion.criteria_type?.code; // 'color', 'size', etc.
          const criteriaTypeId = criterion.criteria_type_id;
          const criteriaValueId = criterion.criteria_value_id;
          const criteriaTypeName = criterion.criteria_type?.name;
          const criteriaValue = criterion.criteria_value || {};

          // Build variant groups structure
          if (!variantsByType[criteriaType]) {
            variantsByType[criteriaType] = new Set();
          }
          variantsByType[criteriaType].add(criteriaValueId);

          // Map criteria values to human-readable names with actual hex codes
          if (criteriaType === 'color') {
            colorSet.add(criteriaValueId);
            // Extract color info from criteria_value or nested color object
            if (!colorMap[criteriaValueId]) {
              const colorName = criteriaValue.name || `Color ${criteriaValueId}`;
              // Try to get hex code from criteria_value, or from nested color object
              const hexCode = criteriaValue.hex_code || criterion.color?.hex_code || getColorHex(criteriaValueId);

              colorMap[criteriaValueId] = {
                id: criteriaValueId,
                name: colorName,
                hex: hexCode,
              };
            }
          }

          if (criteriaType === 'size') {
            sizeSet.add(criteriaValueId);
            if (!sizeMap[criteriaValueId]) {
              const sizeName = criteriaValue.name || `Size ${criteriaValueId}`;
              sizeMap[criteriaValueId] = sizeName;
            }
          }
        });
      }
    });
  }

  // Convert sets to arrays and build colors/sizes arrays
  const colors = Array.from(colorSet).map(id => ({
    id,
    name: colorMap[id]?.name || `Color ${id}`,
    hex: colorMap[id]?.hex || '#C4B84A',
  }));

  const sizes = Array.from(sizeSet).map(id => ({
    id,
    name: sizeMap[id] || `Size ${id}`,
  }));

  // Build variants object for standard product format (variant type -> array of values)
  const variants = {};
  Object.keys(variantsByType).forEach(type => {
    const typeArray = Array.from(variantsByType[type]);
    variants[`${type.charAt(0).toUpperCase() + type.slice(1)}`] = typeArray;
  });

  return {
    id: product.id,
    name: product.name,
    price: parseFloat(product.price),
    currency: 'Rs',
    description: product.description,
    materialDescription: product.material_description,
    categoryId: product.product_category_id,
    category: product.product_category?.name,
    brand: product.brand?.name,
    images: images,
    photos: product.photos || [],
    colors: colors,
    sizes: sizes,
    variants: variants,
    productVariants: product.product_variants || [],
    // Add default details if not provided
    description: product.description || 'Product details coming soon',
    details: product.description || 'Product details coming soon',
    material_description: product.material_description || 'Material information coming soon',
    materials: product.material_description || 'Material information coming soon',
    ingredient_description: product.ingredient_description || 'Ingredient information coming soon',
    ingredients: product.ingredient_description || 'Ingredient information coming soon',
    delivery: 'Free delivery on orders over Rs. 5000. Standard delivery 3–5 working days. Express delivery available at checkout.',
  };
};

/**
 * Generate a hex color code based on criteria value ID
 * In production, this should fetch from API or a color mapping table
 */
export const getColorHex = (criteriaValueId) => {
  const colors = {
    1: '#E85D5D',   // Red
    2: '#C4B84A',   // Olive
    3: '#3B5BA5',   // Navy
    4: '#2BAA96',   // Teal
    5: '#8B4513',   // Brown
    6: '#000000',   // Black
  };
  return colors[criteriaValueId] || '#C4B84A'; // Default to olive
};
