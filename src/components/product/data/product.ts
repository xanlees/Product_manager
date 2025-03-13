import { create } from "zustand";


export type StockSize = {
  id: number;
  size: string;
  stock: number;
};

export type ColorImage = {
  id?: number;
  color_name: string;
  image: string;
  stock_sizes: StockSize[];
};

export interface Products {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
    quantity: number;
    additional_images: string[];
    color_images: ColorImage[];
  }

interface ProductStore {
  selectedProduct: Products | null;
  setProduct: (product: Products) => void;
}
  
export const useProductStore = create<ProductStore>((set) => ({
  selectedProduct: null,
  setProduct: (product) => set({ selectedProduct: product }),
}));

