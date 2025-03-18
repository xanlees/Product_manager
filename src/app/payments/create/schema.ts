import { z } from "zod";


export const StockSizeSchema = z.object({
    id: z.number(),
    size: z.string(),
    stock: z.number().min(0, { message: "Stock cannot be negative" }),
});

export const ColorImageSchema = z.object({
    id: z.number().optional(),
    color_name: z.string().min(1, { message: "Color name is required" }),
    image: z.string().url({ message: "Invalid image URL" }),
    stock_sizes: z.array(StockSizeSchema),
});

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    image: z.string().url({ message: "Invalid image URL" }),
    description: z.string().optional(),
    price: z.number().min(0, { message: "Price must be a positive number" }),
    quantity: z.number().min(0, { message: "Quantity must be a positive number" }),
    additional_images: z.array(z.string().url({ message: "Invalid additional image URL" })),
    color_images: z.array(ColorImageSchema),
});
