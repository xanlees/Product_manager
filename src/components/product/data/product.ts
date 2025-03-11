import { create } from "zustand";


export interface StockSize {
  id: number;
  size: string;
  stock: number;
}

export interface ColorImage {
  id: number;
  color_name: string;
  image: string;
}

export interface Products {
    id: number;
    name: string;
    image: string;
    description: string;
    // sizes: Record<string, number>;
    // color: Record<string, string>;
    price: number;
    quantity: number;
    additional_images: string[];
    stock_sizes: StockSize[];
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

