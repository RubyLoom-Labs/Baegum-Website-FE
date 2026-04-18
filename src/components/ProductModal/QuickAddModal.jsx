import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getProductDetail } from "@/services/product";
import { addToCart as addToCartAPI } from "@/services/cart";
import { getItems } from "@/services/filterItems";

// ─────────────────────────────────────────────────────────────────────────────
// QUICK ADD TO CART MODAL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert photo_path to full image URL
 */
const getFullImageUrl = (photoPath) => {
  if (!photoPath) return null;
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const cleanPath = photoPath.startsWith('/') ? photoPath.substring(1) : photoPath;
  return `${apiUrl}/storage/${cleanPath}`;
};

export default function QuickAddModal({ productId, isOpen, onClose, categoryId }) {
  const { addItem, openCart } = useCart();
  const { isLoggedIn, openLogin } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [combinationError, setCombinationError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [allSizes, setAllSizes] = useState([]);
  const [colorError, setColorError] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Fetch product details
  useEffect(() => {
    if (!isOpen || !productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProductDetail(productId);
        const productData = response.data || response;
        setProduct(productData);
        setDisplayPrice(parseFloat(productData.price) || 0);
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isOpen, productId]);

  // Fetch sizes for category
  useEffect(() => {
    if (!categoryId) return;

    const fetchSizes = async () => {
      try {
        const response = await getItems(`/api/catalog/sizes?category=${categoryId}`);
        const sizes = response.data || response || [];
        setAllSizes(sizes);
      } catch (err) {
        console.error('Failed to fetch sizes:', err);
        setAllSizes([]);
      }
    };

    fetchSizes();
  }, [categoryId]);

  // Find matching variant based on selected color and size
  const findMatchingVariant = (colorId, sizeId) => {
    if (!product?.productVariants) return null;

    return product.productVariants.find(variant => {
      if (!variant.criteria) return false;

      const hasColor = colorId
        ? variant.criteria.some(
            c => c.criteria_type?.code === 'color' && c.criteria_value_id === colorId
          )
        : true;

      const hasSize = sizeId
        ? variant.criteria.some(
            c => c.criteria_type?.code === 'size' && c.criteria_value_id === sizeId
          )
        : true;

      return hasColor && hasSize;
    });
  };

  // Validate combination
  const validateCombination = (colorId, sizeId) => {
    if (!colorId || !sizeId) {
      setCombinationError(null);
      return;
    }

    const matchingVariant = findMatchingVariant(colorId, sizeId);

    if (!matchingVariant || matchingVariant.stock <= 0) {
      setCombinationError(
        'This combination is not available or out of stock.'
      );
    } else {
      setCombinationError(null);
    }
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedColorId(color.id);
    setColorError(false);

    // Update price if variant has special price
    const variant = findMatchingVariant(color.id, selectedSizeId);
    if (variant?.special_price) {
      setDisplayPrice(parseFloat(variant.special_price) || 0);
    } else {
      setDisplayPrice(parseFloat(product.price) || 0);
    }

    // Validate combination
    validateCombination(color.id, selectedSizeId);
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSelectedSizeId(size.id);
    setSizeError(false);

    // Update price if variant has special price
    const variant = findMatchingVariant(selectedColorId, size.id);
    if (variant?.special_price) {
      setDisplayPrice(parseFloat(variant.special_price) || 0);
    } else {
      setDisplayPrice(parseFloat(product.price) || 0);
    }

    // Validate combination
    validateCombination(selectedColorId, size.id);
  };

  // Get available colors from product variants
  const getAvailableColors = () => {
    if (!product?.productVariants) return [];

    const colors = new Map();
    product.productVariants.forEach(variant => {
      if (variant.stock > 0) {
        const colorCriteria = variant.criteria?.find(c => c.criteria_type?.code === 'color');
        if (colorCriteria && colorCriteria.criteria_value_id) {
          if (!colors.has(colorCriteria.criteria_value_id)) {
            colors.set(colorCriteria.criteria_value_id, {
              id: colorCriteria.criteria_value_id,
              name: colorCriteria.criteria_value?.value || colorCriteria.criteria_value?.label,
              hex: colorCriteria.criteria_value?.hex_code,
            });
          }
        }
      }
    });

    return Array.from(colors.values());
  };

  // Get available sizes for selected color
  const getAvailableSizes = () => {
    if (!product?.productVariants) return allSizes;

    if (!selectedColorId) return allSizes;

    const availableSizeIds = new Set();
    product.productVariants.forEach(variant => {
      if (variant.stock > 0) {
        const hasColor = variant.criteria?.some(
          c => c.criteria_type?.code === 'color' && c.criteria_value_id === selectedColorId
        );

        if (hasColor) {
          const sizeCriteria = variant.criteria?.find(c => c.criteria_type?.code === 'size');
          if (sizeCriteria) {
            availableSizeIds.add(sizeCriteria.criteria_value_id);
          }
        }
      }
    });

    return allSizes.filter(size => availableSizeIds.has(size.id));
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }

    // Validate required fields
    if (categoryId === 2 || categoryId === 4) {
      if (!selectedColor) {
        setColorError(true);
        return;
      }
    } else if (categoryId === 3) {
      if (!selectedSize) {
        setSizeError(true);
        return;
      }
    }

    if (combinationError) return;

    setAddingToCart(true);
    setCartError(null);

    try {
      const selectedVariant = findMatchingVariant(selectedColorId, selectedSizeId);

      const cartItemData = {
        product_id: product.id,
        quantity: 1,
        price: displayPrice,
        variant_id: selectedVariant?.id,
      };

      const addResponse = await addToCartAPI(cartItemData);
      const apiData = addResponse.data || addResponse;

      // Get product image
      const photos = product.photos || [];
      const primaryPhoto = photos.find(p => p.is_primary) || photos[0];
      const imageUrl = primaryPhoto ? getFullImageUrl(primaryPhoto.photo_path) : null;

      addItem({
        id: apiData.id,
        product_id: product.id,
        name: product.name,
        price: displayPrice,
        image: imageUrl,
        variant: [selectedSize?.value, selectedColor?.name].filter(Boolean).join(' / '),
        variant_id: selectedVariant?.id,
        stock: selectedVariant?.stock || 0,
        cart_item_id: apiData.id,
      });

      openCart();
      onClose();
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setCartError(err.message || 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        onClick={onClose}
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
      />

      {/* Modal */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-lg
                   transform transition-transform duration-300 overflow-y-auto"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-[16px] font-medium text-[#1a1a1a]">Add to Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">Loading product...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-500 text-center">{error}</p>
            </div>
          ) : product ? (
            <>
              {/* Product Image */}
              <div className="mb-6">
                {product.photos?.[0] && (
                  <img
                    src={getFullImageUrl(product.photos[0].photo_path)}
                    alt={product.name}
                    className="w-full h-64 object-cover object-top rounded bg-gray-100"
                  />
                )}
              </div>

              {/* Product Info */}
              <div className="mb-6">
                <h3 className="text-[15px] font-medium text-[#1a1a1a] mb-2">
                  {product.name}
                </h3>
                <p className="text-[13px] text-gray-600 mb-4">
                  {product.sub_topic || product.product_category?.name}
                </p>
                <p className="text-[18px] font-medium text-[#1a1a1a]">
                  Rs.{(parseFloat(displayPrice) || 0).toFixed(2)}
                </p>
              </div>

              {/* Color Selection - Categories 2 and 4 */}
              {(categoryId === 2 || categoryId === 4) && (
                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-[#1a1a1a] mb-3">
                    Color {colorError && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {getAvailableColors().map(color => (
                      <button
                        key={color.id}
                        onClick={() => handleColorSelect(color)}
                        className="flex items-center gap-2 px-3 py-2 border rounded transition-colors"
                        style={{
                          borderColor: selectedColorId === color.id ? '#1a1a1a' : '#d1d5db',
                          backgroundColor: selectedColorId === color.id ? '#f3f4f6' : 'white',
                        }}
                      >
                        {color.hex && (
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.hex }}
                          />
                        )}
                        <span className="text-[12px] font-medium text-[#1a1a1a]">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  {colorError && (
                    <p className="text-red-500 text-[12px] mt-2">Please select a color</p>
                  )}
                </div>
              )}

              {/* Size Selection - Category 3 or others with sizes */}
              {(categoryId === 3 || (categoryId !== 2 && categoryId !== 4 && allSizes.length > 0)) && (
                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-[#1a1a1a] mb-3">
                    Size {sizeError && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getAvailableSizes().map(size => (
                      <button
                        key={size.id}
                        onClick={() => handleSizeSelect(size)}
                        className="px-4 py-2 border text-[12px] font-medium rounded transition-colors"
                        style={{
                          borderColor: selectedSizeId === size.id ? '#1a1a1a' : '#d1d5db',
                          backgroundColor: selectedSizeId === size.id ? '#1a1a1a' : 'white',
                          color: selectedSizeId === size.id ? '#ffffff' : '#1a1a1a',
                        }}
                      >
                        {size.value || size.label}
                      </button>
                    ))}
                  </div>
                  {sizeError && (
                    <p className="text-red-500 text-[12px] mt-2">Please select a size</p>
                  )}
                </div>
              )}

              {/* Error Messages */}
              {combinationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-[12px] text-red-600">{combinationError}</p>
                </div>
              )}

              {cartError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-[12px] text-red-600">{cartError}</p>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || combinationError}
                className="w-full py-3 bg-[#1a1a1a] text-white text-[13px] font-medium
                           rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-black active:bg-gray-900"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
