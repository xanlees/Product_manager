


// types.ts
export type StockSize = {
    id?: number;
    size: string;
    stock: number;
};

export type ColorImage = {
    color_name: string;
    image: File | null;
    stock_sizes: StockSize[];
};

export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    image: File | null;
    additional_images: File[];
    color_images: ColorImage[];
}



