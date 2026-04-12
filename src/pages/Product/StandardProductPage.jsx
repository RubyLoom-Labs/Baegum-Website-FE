import { useState, useEffect } from "react";
import ImageGallery from "./components/ImageGallery";
import AccordionSection from "./components/AccordionSection";
import ReviewSection, { ReviewModal } from "./components/ReviewSection";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { getItems } from "@/services/filterItems";
import { addToCart as addToCartAPI } from "@/services/cart";
import { submitProductReview, getProductDetail } from "@/services/product";
import { transformProductData } from "@/utils/productTransformer";

import wishlistIcon from "@/assets/icons/wishlist.svg";

// ─────────────────────────────────────────────────────────────────────────────
// STANDARD PRODUCT PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function StandardProductPage({ product, categoryId }) {
  const { addItem, openCart } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { isLoggedIn, openLogin } = useAuth();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize,  setSelectedSize]  = useState(null);
  const [added,         setAdded]         = useState(false);
  const [sizeError,     setSizeError]     = useState(false);
  const [colorError,    setColorError]    = useState(false);
  const [allSizes,      setAllSizes]      = useState([]);
  const [loadingSizes,  setLoadingSizes]  = useState(false);

  // New state for tracking IDs and dynamic pricing
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSizeId,  setSelectedSizeId]  = useState(null);
  const [displayPrice,    setDisplayPrice]    = useState(product.price);
  const [combinationError, setCombinationError] = useState(null);
  const [addingToCart,    setAddingToCart]    = useState(false);
  const [cartError,       setCartError]       = useState(null);
  const [reviews,         setReviews]         = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [toast,           setToast]           = useState(null);

  // Fetch all available sizes for this category
  useEffect(() => {
    const fetchCategorySizes = async () => {
      if (!categoryId) return;
      try {
        setLoadingSizes(true);
        const response = await getItems(`/api/catalog/sizes?category=${categoryId}`);
        // Assuming response is { data: [...] } or direct array
        const sizes = response.data || response || [];
        setAllSizes(sizes);
      } catch (error) {
        console.error("Failed to fetch category sizes:", error);
        setAllSizes([]);
      } finally {
        setLoadingSizes(false);
      }
    };

    fetchCategorySizes();
  }, [categoryId]);

  // Fetch reviews from product data
  useEffect(() => {
    if (product?.reviews && Array.isArray(product.reviews)) {
      setReviews(product.reviews);
      console.log('Reviews loaded:', product.reviews);
    }
  }, [product?.id, product?.reviews]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      setSubmittingReview(true);
      await submitProductReview({
        product_id: product.id,
        ...reviewData
      });
      showToast('Thank you! Your review has been submitted successfully.');
      setShowReviewModal(false);
      
      // Refetch product data to show the newly added review
      try {
        const apiData = await getProductDetail(product.id);
        const transformedProduct = transformProductData(apiData);
        if (transformedProduct?.reviews) {
          setReviews(transformedProduct.reviews);
          console.log('Reviews updated:', transformedProduct.reviews);
        }
      } catch (err) {
        console.error('Failed to refetch reviews:', err);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      showToast('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Check if a size is available with the selected color (and has stock)
  const isSizeAvailableWithColor = (sizeId, colorId) => {
    if (!product.productVariants) return false;

    return product.productVariants.some(variant => {
      if (variant.stock <= 0) return false;

      const criteria = variant.criteria || [];
      const hasSize = criteria.some(
        c => c.criteria_type?.code === 'size' && c.criteria_value_id === sizeId
      );
      const hasColor = criteria.some(
        c => c.criteria_type?.code === 'color' && c.criteria_value_id === colorId
      );

      return hasSize && hasColor;
    });
  };

  // Check if a color is available with the selected size (and has stock)
  const isColorAvailableWithSize = (colorId, sizeId) => {
    if (!product.productVariants) return false;

    return product.productVariants.some(variant => {
      if (variant.stock <= 0) return false;

      const criteria = variant.criteria || [];
      const hasColor = criteria.some(
        c => c.criteria_type?.code === 'color' && c.criteria_value_id === colorId
      );
      const hasSize = criteria.some(
        c => c.criteria_type?.code === 'size' && c.criteria_value_id === sizeId
      );

      return hasColor && hasSize;
    });
  };

  // Validate combination and show error if incompatible
  const validateCombination = (colorId, sizeId) => {
    if (!colorId || !sizeId) {
      setCombinationError(null);
      return;
    }

    const isValid = isSizeAvailableWithColor(sizeId, colorId);

    if (!isValid) {
      setCombinationError(
        `This combination of color and size is not available or out of stock. Please select different options.`
      );
    } else {
      setCombinationError(null);
    }
  };

  // Check if a size has stock > 0 in product variants
  const isSizeInStock = (sizeId) => {
    if (!product.productVariants || product.productVariants.length === 0) {
      return false;
    }

    return product.productVariants.some(variant => {
      // Check if variant has this size and stock > 0
      const hasSize = variant.criteria?.some(
        criterion =>
          criterion.criteria_type?.code === 'size' &&
          criterion.criteria_value_id === sizeId
      );
      return hasSize && variant.stock > 0;
    });
  };

  // Check if a color has stock > 0 in product variants
  const isColorInStock = (colorId) => {
    if (!product.productVariants || product.productVariants.length === 0) {
      return false;
    }

    return product.productVariants.some(variant => {
      // Check if variant has this color and stock > 0
      const hasColor = variant.criteria?.some(
        criterion =>
          criterion.criteria_type?.code === 'color' &&
          criterion.criteria_value_id === colorId
      );
      return hasColor && variant.stock > 0;
    });
  };

  // Find matching variant based on selected color and size
  const findMatchingVariant = (colorId, sizeId) => {
    if (!product.productVariants) return null;

    return product.productVariants.find(variant => {
      if (!variant.criteria) return false;

      const hasColor = colorId
        ? variant.criteria.some(
            c => c.criteria_type?.code === 'color' && c.criteria_value_id === colorId
          )
        : true; // If no color selected, don't filter by color

      const hasSize = sizeId
        ? variant.criteria.some(
            c => c.criteria_type?.code === 'size' && c.criteria_value_id === sizeId
          )
        : true; // If no size selected, don't filter by size

      return hasColor && hasSize;
    });
  };

  // Update price when color or size changes
  useEffect(() => {
    if (selectedColorId || selectedSizeId) {
      const matchingVariant = findMatchingVariant(selectedColorId, selectedSizeId);
      if (matchingVariant && matchingVariant.special_price) {
        setDisplayPrice(parseFloat(matchingVariant.special_price));
      } else {
        setDisplayPrice(product.price);
      }
    } else {
      setDisplayPrice(product.price);
    }
  }, [selectedColorId, selectedSizeId, product]);

  const handleAddToCart = async () => {

    if (!isLoggedIn) {
      openLogin();
      return;
    }

    // Category 2 and 4: Only validate color
    if (categoryId === 2 || categoryId === 4) {
      if (!selectedColor) { setColorError(true); return; }
    }
    // Category 3: Only validate size
    else if (categoryId === 3) {
      if (!selectedSize) { setSizeError(true); return; }
    }
    // Other categories: Validate both color and size
    /* else {
      if (!selectedColor) { setColorError(true); return; }
      if (!selectedSize) { setSizeError(true); return; }
    } */

    if (combinationError) {
      // Combination is invalid, don't add to cart
      return;
    }

    setSizeError(false);
    setColorError(false);
    setCartError(null);
    setAddingToCart(true);

    try {
      // Find the matching variant ID
      const selectedVariant = product.productVariants?.find(variant => {
        const criteria = variant.criteria || [];
        const matches = [];

        if (selectedSizeId) {
          matches.push(criteria.some(
            c => c.criteria_type?.code === 'size' && c.criteria_value_id === selectedSizeId
          ));
        }

        if (selectedColorId) {
          matches.push(criteria.some(
            c => c.criteria_type?.code === 'color' && c.criteria_value_id === selectedColorId
          ));
        }

        return matches.length > 0 && matches.every(m => m === true);
      });

      // Prepare cart item data for API
      const cartItemData = {
        product_id: product.id,
        quantity: 1,
        price: displayPrice,
        variant_id: selectedVariant?.id
      };

      // Save to backend first
      const addResponse = await addToCartAPI(cartItemData);
      const apiData = addResponse.data || addResponse;

      // Then add to frontend cart
      addItem({
        id: apiData.id, // Use cart item ID from API as unique identifier
        product_id: product.id,
        name: product.name,
        price: displayPrice,
        image: product.images?.[0] || null,
        variant: [selectedSize, selectedColor?.name].filter(Boolean).join(" / "),
        variant_id: selectedVariant?.id,
        stock: selectedVariant?.stock || 0,
        cart_item_id: apiData.id, // Store same ID for clarity
      });

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      openCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setCartError(error.message || 'Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">

        {/* ── Main product area ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* Left: image gallery */}
          <ImageGallery images={product.images || []} />

          {/* Right: product info */}
          <div className="flex flex-col">

            {/* Name + wishlist */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-[24px] md:text-[28px] font-light text-[#1a1a1a]
                             leading-tight tracking-wide">
                {product.name}
              </h1>
              <button
                onClick={() => toggleItem({ id: product.id, name: product.name,
                  price: product.price, image: product.images?.[0] || null })}
                className="hover:opacity-60 transition-opacity mt-1 flex-shrink-0"
                aria-label="Wishlist"
              >
                <img src={wishlistIcon} width={22} height={22}
                  alt="Wishlist" draggable={false}
                  style={{ opacity: wishlisted ? 1 : 0.5 }} />
              </button>
            </div>

            {/* Price */}
            <p className="text-[16px] text-[#1a1a1a] font-light mt-2">
              {product.currency} {displayPrice.toLocaleString()}/=
            </p>

            {/* Color swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <p className="text-[13px] font-medium text-[#1a1a1a] mb-2.5 tracking-wide">
                  Colors
                  {selectedColor && (
                    <span className="font-light text-gray-500 ml-1.5">
                      — {selectedColor.name}
                    </span>
                  )}
                </p>
                <div className="flex gap-2.5 flex-wrap">
                  {product.colors.map((color) => {
                    const active = selectedColor?.id === color.id;
                    const inStock = isColorInStock(color.id);
                    // If size is selected, also check if this color is available with that size
                    const compatibleWithSize = selectedSizeId
                      ? isSizeAvailableWithColor(selectedSizeId, color.id)
                      : true;
                    const isColorAvailable = inStock && compatibleWithSize;

                    return (
                      <button
                        key={color.id}
                        onClick={() => {
                          if (isColorAvailable) {
                            setSelectedColor(color);
                            setSelectedColorId(color.id);
                            // Validate with currently selected size
                            validateCombination(color.id, selectedSizeId);
                          }
                        }}
                        disabled={!isColorAvailable}
                        aria-label={color.name}
                        className={`transition-all duration-200 ${isColorAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        style={{
                          width:      32,
                          height:     32,
                          borderRadius: "50%",
                          backgroundColor: color.hex,
                          border:     active && isColorAvailable ? "2.5px solid #1a1a1a" : "2.5px solid transparent",
                          outline:    active && isColorAvailable ? "2px solid white"      : "none",
                          outlineOffset: "-4px",
                          opacity:    isColorAvailable ? 1 : 0.5,
                        }}
                        title={`${color.name}${!inStock ? ' (Out of stock)' : !compatibleWithSize ? ' (Not available with selected size)' : ''}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color error message */}
            {colorError && (
              <p className="text-[11px] text-red-500 mt-1.5">Please select a color</p>
            )}

            {/* Size selector */}
            {allSizes && allSizes.length > 0 && (
              <div className="mt-5">
                <p className="text-[13px] font-medium text-[#1a1a1a] mb-2.5 tracking-wide">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => {
                    const sizeId = size.id || size;
                    const sizeName = size.name || size;
                    const inStock = isSizeInStock(sizeId);
                    // If color is selected, also check if this size is available with that color
                    const compatibleWithColor = selectedColorId
                      ? isColorAvailableWithSize(selectedColorId, sizeId)
                      : true;
                    const isSizeAvailable = inStock && compatibleWithColor;
                    const active = selectedSize === sizeName;

                    return (
                      <button
                        key={sizeId}
                        onClick={() => {
                          if (isSizeAvailable) {
                            setSelectedSize(sizeName);
                            setSelectedSizeId(sizeId);
                            setSizeError(false);
                            // Validate with currently selected color
                            validateCombination(selectedColorId, sizeId);
                          }
                        }}
                        disabled={!isSizeAvailable}
                        className={`px-4 py-1.5 rounded-full text-[12px] font-light
                                   transition-all duration-200 border ${
                                     isSizeAvailable ? 'cursor-pointer' : 'cursor-not-allowed'
                                   }`}
                        style={{
                          borderColor:     active && isSizeAvailable ? "#1a1a1a" : "#e5e7eb",
                          backgroundColor: active && isSizeAvailable ? "#1a1a1a" : "white",
                          color:           active && isSizeAvailable ? "white" : isSizeAvailable ? "#1a1a1a" : "#ccc",
                          opacity:         isSizeAvailable ? 1 : 0.5,
                        }}
                        title={
                          !inStock ? "Out of stock" :
                          !compatibleWithColor ? "Not available with selected color" :
                          ""
                        }
                      >
                        {sizeName}
                      </button>
                    );
                  })}
                </div>
                {sizeError && (
                  <p className="text-[11px] text-red-500 mt-1.5">Please select a size</p>
                )}
              </div>
            )}

            {/* Combination error message */}
            {combinationError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-[12px] text-red-600 font-light">
                  ⚠️ {combinationError}
                </p>
              </div>
            )}

            {/* Cart error message */}
            {cartError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-[12px] text-red-600 font-light">
                  {cartError}
                </p>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full py-4 bg-[#1a1a1a] hover:bg-gray-800 active:bg-gray-700
                           text-white text-[14px] font-medium tracking-wide transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? "Adding to Cart..." : added ? "Added ✓" : "Buy Now"}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full py-4 border border-gray-300 hover:border-[#1a1a1a]
                           hover:bg-gray-50 active:bg-gray-100 text-[#1a1a1a] text-[14px]
                           font-medium tracking-wide transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            {/* Accordions */}
            <div className="mt-8 border-t border-gray-200">
              <AccordionSection title="Details & Features">
                <div
                  className="prose prose-sm max-w-none text-[14px] text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product.description || product.details || 'Product details coming soon' }}
                />
              </AccordionSection>
              <AccordionSection title="Materials">
                <div
                  className="prose prose-sm max-w-none text-[14px] text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product.material_description || product.materials || 'Material information coming soon' }}
                />
              </AccordionSection>
              <AccordionSection title="Ingredients">
                <div className="flex flex-col gap-4">
                  {product.ingredient_description && (
                    <div
                      className="prose prose-sm max-w-none text-[14px] text-gray-700"
                      dangerouslySetInnerHTML={{ __html: product.ingredient_description }}
                    />
                  )}
                  {!product.ingredient_description && (
                    <p>Ingredient information coming soon</p>
                  )}
                </div>
              </AccordionSection>
              <AccordionSection title="Delivery & Payment">
                <p className="text-[14px] text-gray-700">{product.delivery}</p>
              </AccordionSection>
            </div>
          </div>
        </div>

        {/* ── Reviews ────────────────────────────────────────────── */}
        <ReviewSection
          productId={product.id}
          reviews={reviews}
          isLoggedIn={isLoggedIn}
          openLogin={openLogin}
          onWriteReview={() => setShowReviewModal(true)}
        />

        {/* Review Modal */}
        {showReviewModal && (
          <ReviewModal
            productId={product.id}
            onClose={() => setShowReviewModal(false)}
            onSubmit={handleSubmitReview}
            isSubmitting={submittingReview}
          />
        )}

        {/* Toast notification */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-6 py-3
                          bg-green-600 text-white text-[13px] font-light rounded-sm shadow-xl
                          transition-all duration-300 whitespace-nowrap">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
