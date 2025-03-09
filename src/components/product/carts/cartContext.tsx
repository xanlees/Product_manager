"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface CartItem {
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
      const existingItem = prevCart.find(
        (item) => item.id === newItem.id && item.size === newItem.size
      );
  
      if (existingItem) {
        // ✅ Update quantity if the same product + size exists
        return prevCart.map((item) =>
          item.id === newItem.id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // ✅ Otherwise, add a new entry
        return [...prevCart, newItem];
      }
    });
  
    localStorage.setItem("cart", JSON.stringify(cartItems)); // ✅ Save to localStorage
  };


  const removeFromCart = (id: number, size: string) => {
    if (!window.confirm("Are you sure you want to remove this product?")) return;
  
    setCartItems((prev) => {
      const updatedCart = prev.filter((item) => !(item.id === id && item.size === size));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  
    try {
      console.log("Removing product", id, size);
      alert("Product removed successfully");
    } catch (err) {
      console.error("Error removing product", err);
      alert("Failed to remove product");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.length,
        addToCart,
        removeFromCart,
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
