import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState([
    // Sample item — remove when connected to backend
    {
      id: 1,
      name: "Oatmeal V-Neck Dress",
      variant: "L / Red color",
      price: 0,
      image: null,
      qty: 1,
    },
  ]);

  const openCart  = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const increaseQty = (id) =>
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, qty: item.qty + 1 } : item)
    );

  const decreaseQty = (id) =>
    setItems((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, qty: item.qty - 1 } : item)
        .filter((item) => item.qty > 0)
    );

  const removeItem = (id) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
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
      total, count,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);