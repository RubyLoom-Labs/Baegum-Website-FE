import { createContext, useContext, useState, useEffect } from "react";
import { getWishlistItems, addToWishlist, removeFromWishlist } from "@/services/wishlist";
import { useAuth } from "@/context/AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  const openWishlist  = () => setWishlistOpen(true);
  const closeWishlist = () => setWishlistOpen(false);

  // Fetch wishlist items from backend on component mount and when auth state changes
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);

        // If not logged in, clear wishlist
        if (!isLoggedIn) {
          setItems([]);
          return;
        }

        const response = await getWishlistItems();

        // Handle different response structures
        let wishlistData = response;
        if (response.data) {
          wishlistData = response.data.data || response.data;
        }

        // Map backend response to frontend format
        const formattedItems = Array.isArray(wishlistData)
          ? wishlistData.map(item => ({
              id: item.product?.id || item.product_id || item.id,
              name: item.product?.name || item.name || '',
              price: parseFloat(item.product?.price || item.price || 0),
              image: item.product?.images?.[0] || item.image || null,
              variant: item.variant || '',
            }))
          : [];

        setItems(formattedItems);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        // Clear on error if logged in
        if (isLoggedIn) {
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isLoggedIn]);

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = (product) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const isWishlisted = (id) => items.some((item) => item.id === id);

  const toggleItem = async (product) => {
    const isCurrentlyWishlisted = isWishlisted(product.id);

    try {
      if (isCurrentlyWishlisted) {
        // Remove from wishlist - both backend and frontend
        await removeFromWishlist(product.id);
        removeItem(product.id);
      } else {
        // Add to wishlist - both backend and frontend
        await addToWishlist(product.id);
        addItem(product);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const count = items.length;

  return (
    <WishlistContext.Provider value={{
      wishlistOpen, openWishlist, closeWishlist,
      items, addItem, removeItem, toggleItem, isWishlisted,
      count, loading,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
