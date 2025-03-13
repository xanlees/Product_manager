"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, size: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart) || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (newItem: CartItem) => {
    setCartItems((prevCart) => {
      console.log("Cart before adding:", prevCart);

      const existingItem = prevCart.find(
        (item) => item.id === newItem.id && item.size === newItem.size
      );

      if (existingItem) {
        console.log(`Updating quantity for ${newItem.id}-${newItem.size}`);
        return prevCart.map((item) =>
          item.id === newItem.id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        console.log(`Adding new item: ${newItem.id}-${newItem.size}`);
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (id: number, size: string) => {
    setCartItems((prev) => {
      const updatedCart = prev.filter(
        (item) => !(item.id === id && item.size === size)
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };


  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.length,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
