import { createContext, useContext, useState, useEffect } from "react";
import { getCartItems as fetchCartItems, updateCartItem as updateCartItemAPI, removeFromCart as removeFromCartAPI } from "@/services/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Fetch cart items on app load if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setItems([]);
      return;
    }

    const syncCartFromBackend = async () => {
      try {
        setLoadingCart(true);
        const response = await fetchCartItems();

        // Handle both array and paginated response formats
        const cartItemsArray = response.data || response || [];

        // Transform API response to frontend cart format
        const mappedItems = cartItemsArray.map(item => {
          const quantity = item.quantity || 1;
          const variantStock = item.product_variant?.stock || 0;
          // Ensure stock is at least equal to current quantity
          const stock = Math.max(variantStock, quantity);

          return {
            id: item.id,
            product_id: item.product_id,
            name: item.product?.name || "Unknown Product",
            price: parseFloat(item.product?.price || item.price || 0),
            image: item.product?.images?.[0] || null,
            qty: quantity,
            variant_id: item.product_variant_id,
            stock: stock, // Include variant stock for validation
            cart_item_id: item.id, // Store original cart item ID for updates/deletes
          };
        });

        setItems(mappedItems);
      } catch (error) {
        console.error("Failed to sync cart from backend:", error);
        setItems([]);
      } finally {
        setLoadingCart(false);
      }
    };

    syncCartFromBackend();
  }, [isLoggedIn]);

  const openCart  = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  // Increase quantity with stock validation and backend sync
  const increaseQty = async (id) => {
    const itemToUpdate = items.find(item => item.id === id);

    if (!itemToUpdate) return;

    // Validate stock before increasing - prevent qty from exceeding stock
    const newQty = itemToUpdate.qty + 1;
    if (newQty > itemToUpdate.stock) {
      setUpdateError(`Cannot exceed stock. Maximum available: ${itemToUpdate.stock}`);
      setTimeout(() => setUpdateError(null), 3000);
      return;
    }

    try {
      setUpdateError(null);
      // Update backend first
      await updateCartItemAPI(itemToUpdate.cart_item_id, {
        quantity: newQty,
        product_id: itemToUpdate.product_id,
        variant_id: itemToUpdate.variant_id
      });

      // Then update frontend
      setItems((prev) =>
        prev.map((item) => item.id === id ? { ...item, qty: item.qty + 1 } : item)
      );
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
      setUpdateError(error.message || 'Failed to update quantity');
      setTimeout(() => setUpdateError(null), 3000);
    }
  };

  // Decrease quantity with backend sync
  const decreaseQty = async (id) => {
    const itemToUpdate = items.find(item => item.id === id);

    if (!itemToUpdate || itemToUpdate.qty <= 1) return;

    try {
      setUpdateError(null);
      // Update backend first
      await updateCartItemAPI(itemToUpdate.cart_item_id, {
        quantity: itemToUpdate.qty - 1,
        product_id: itemToUpdate.product_id,
        variant_id: itemToUpdate.variant_id
      });

      // Then update frontend
      setItems((prev) =>
        prev.map((item) => item.id === id ? { ...item, qty: item.qty - 1 } : item)
          .filter((item) => item.qty > 0)
      );
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
      setUpdateError(error.message || 'Failed to update quantity');
      setTimeout(() => setUpdateError(null), 3000);
    }
  };

  // Remove item from cart with backend sync
  const removeItem = async (id) => {
    const itemToRemove = items.find(item => item.id === id);

    if (!itemToRemove) return;

    try {
      setUpdateError(null);
      // Delete from backend first
      await removeFromCartAPI(itemToRemove.cart_item_id, {
        product_id: itemToRemove.product_id,
        variant_id: itemToRemove.variant_id
      });

      // Then remove from frontend
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      setUpdateError(error.message || 'Failed to remove item');
      setTimeout(() => setUpdateError(null), 3000);
    }
  };

  const addItem = (product) => {
    setItems((prev) => {
      // Look for existing item with same product_id and variant_id
      const existing = prev.find((i) =>
        i.product_id === product.product_id && i.variant_id === product.variant_id
      );
      if (existing) {
        // Don't allow inlining - keep variant stock as is
        const newQty = existing.qty + 1;
        const maxStock = existing.stock || 0;

        // Prevent increasing if would exceed stock
        if (newQty > maxStock) {
          setUpdateError(`Cannot exceed stock. Maximum available: ${maxStock}`);
          setTimeout(() => setUpdateError(null), 3000);
          return prev; // Don't change
        }

        return prev.map((i) =>
          i.product_id === product.product_id && i.variant_id === product.variant_id
            ? { ...i, qty: newQty }
            : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{
      cartOpen, openCart, closeCart,
      items, addItem, removeItem, increaseQty, decreaseQty,
      total, count, loadingCart, updateError,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
