import { createContext, useContext, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [items, setItems] = useState([
    // Sample item — remove when connected to backend
    {
      id: 1,
      name: "Oatmeal V-Neck Dress",
      variant: "L / Red color",
      price: 0,
      image: null,
    },
  ]);

  const openWishlist  = () => setWishlistOpen(true);
  const closeWishlist = () => setWishlistOpen(false);

  const removeItem = (id) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const addItem = (product) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const isWishlisted = (id) => items.some((item) => item.id === id);

  const toggleItem = (product) => {
    if (isWishlisted(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const count = items.length;

  return (
    <WishlistContext.Provider value={{
      wishlistOpen, openWishlist, closeWishlist,
      items, addItem, removeItem, toggleItem, isWishlisted,
      count,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);