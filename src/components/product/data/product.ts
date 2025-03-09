import { create } from "zustand";

export interface Products {
    id: number;
    name: string;
    image: string;
    description: string;
    sizes: Record<string, number>;
    color: string;
    price: number;
    quantity: number;
    additional_images?: string[];
  }

interface ProductStore {
  selectedProduct: Products | null;
  setProduct: (product: Products) => void;
}
  
export const useProductStore = create<ProductStore>((set) => ({
  selectedProduct: null,
  setProduct: (product) => set({ selectedProduct: product }),
}));