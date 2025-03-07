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
    cart: [],
    addToCart: (product) =>
      set((state) => {
        const existingProduct = state.cart.find((item) => item.id === product.id);
  
        if (existingProduct) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item
            ),
          };
        }
  
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),
  
    removeFromCart: (id) =>
      set((state) => ({
        cart: state.cart.filter((item) => item.id !== id),
      })),
  
    clearCart: () => set({ cart: [] }),
  }));