
"use client"

import { create } from "zustand";

interface Product {
    id: string;
    name: string;
    price: number;
    size?: string;
    color?: string;
    stock?: number;
    image?: string;
    quantity?: number;
  }

  interface CartStore {
    cart: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
  }

  export const useCartStore = create<CartStore>((set) => ({
    cart: JSON.parse(localStorage.getItem("cart") || "[]"),
    addToCart: (item) =>
      set((state) => {
        const updatedCart = [...state.cart, item];
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ Save to local storage
        return { cart: updatedCart };
      }),
  
      removeFromCart: (id) =>
        set((state) => {
          const updatedCart = state.cart.filter((item) => item.id !== id);
          localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ Update storage
          return { cart: updatedCart };
        }),
  
        clearCart: () => {
          localStorage.removeItem("cart"); // ✅ Clear local storage
          return set({ cart: [] });
        }
  }
));