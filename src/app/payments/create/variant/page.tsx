"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormData } from "../value";
import { Plus, Trash } from "lucide-react";

export const productSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    price: z.number().min(1, { message: "Price must be at least 1" }),
    description: z.string().optional(),
    image: z.instanceof(File).nullable().optional(), // ✅ Allow null
    additional_images: z.array(z.instanceof(File)).optional(),
    color_images: z.array(
        z.object({
            color_name: z.string().min(1, "Color name is required"),
            image: z.instanceof(File).nullable().optional(), // ✅ Allow null
            stock_sizes: z.array(
                z.object({
                    id: z.number(),
                    size: z.string().min(1, "Size is required"),
                    stock: z.number().min(1, "Stock must be at least 1"),
                })
            ),
        })
    ),
});



export default function CreateProduct() {

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            image: undefined,
            additional_images: [],
            color_images: [
                {
                 color_name: "",
                 image: undefined, 
                 stock_sizes: [{ id: Date.now(), size: "", stock: 0 }],
                }
            ],
        },
    });

    const { fields: colorFields, append: addColor, remove: removeColor } = useFieldArray({
        control,
        name: "color_images",
    });

    const { fields: stockFields,  remove: removeStock } = useFieldArray({
        control,
        name: `color_images.${colorFields.length - 1}.stock_sizes`,
    });


    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        if (files.length > 0) {
            // ✅ Update react-hook-form state
            setValue("additional_images", [...selectedFiles, ...files]);

            // ✅ Generate preview URLs
            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setPreviewImages((prev) => [...prev, ...newPreviews]); // Append new images
            setSelectedFiles((prev) => [...prev, ...files]); 
        }
    };

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
        // if (file) {
        //   const reader = new FileReader();
        //   reader.onloadend = () => {
        //     setPreview(reader.result as string);
        //   };
        //   reader.readAsDataURL(file);
        // }
    };

    const { fields: colors, append: addNewColor } = useFieldArray({ control, name: "color_images" });

    const addStock = (colorIndex: number) => {
        const stockSizes = colors[colorIndex]?.stock_sizes || [];
        setValue(`color_images.${colorIndex}.stock_sizes`, [
            ...stockSizes,
            { id: Date.now(), size: "", stock: 0 },
        ]);
    };




    const onSubmit = async (data: ProductFormData) => {
        console.log("Submitting:", data);

        const formData = new FormData();
        formData.append(
            "translations",
            JSON.stringify({ en: { name: data.name } })
        );
        formData.append("description", data.description);
        formData.append("price", data.price.toString());

        if (data.image) formData.append("image", data.image);

        data.additional_images.forEach((file, index) => {
            formData.append(`additional_images[${index}]`, file);
        });

        data.color_images.forEach((color, colorIndex) => {
            formData.append(`color_images[${colorIndex}][color_name]`, color.color_name);
            if (color.image) formData.append(`color_images[${colorIndex}][image]`, color.image);

            color.stock_sizes.forEach((stock, stockIndex) => {
                formData.append(`color_images[${colorIndex}][stock_sizes][${stockIndex}][size]`, stock.size);
                formData.append(`color_images[${colorIndex}][stock_sizes][${stockIndex}][stock]`, stock.stock.toString());
            });
        });

        try {
            const response = await fetch("http://localhost:8000/api/v1/products", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to create product");
            }
     
            console.log("✅ Product Created!");
            window.location.reload()
        } catch (error) {
            console.error("❌ Error:", error);
        }
    };

    console.log("dataaaaaaaaa", onSubmit);

    return (
        <Card className="max-w-3xl mx-auto p-6 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Create Product</h2>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-64 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadIcon className="w-10 h-10 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <div>
                                <Label>Product Image</Label>
                                <input type="file" onChange={(e) => setValue("image", e.target.files?.[0] || null)} className=" text-black"/>
                            </div>
                        </label>
                    </div>
                    {preview && (
                        <div className="mt-4">
                            <p className="">Current Image:</p>
                            <Image width={40} height={40} src={preview} alt="Preview" className="w-24 h-28 " />
                        </div>
                    )}
                    {selectedFile && (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium ">{selectedFile.name}</p>
                                <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                    )}
                    {/* ✅ Product Name */}
                    <div>
                        <Label>Name</Label>
                        <Input {...register("name")} placeholder="Enter product name" />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Textarea {...register("description")} placeholder="Enter product name" />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    </div>

                    {/* ✅ Product Price */}
                    <div>
                        <Label>Price</Label>
                        <Input type="number" {...register("price", { valueAsNumber: true })} />
                        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
                    </div>

                    {/* ✅ Image Upload */}
                    {/* <div>
                        <Label>Additional Images</Label>
                        <input type="file" multiple {...register("additional_images")} onChange={handleImageChange} />
                        <div className="mt-3 flex flex-wrap gap-2">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <img
                                        src={previewImages[index]}
                                        alt={`Preview ${index}`}
                                        className="w-24 h-24 rounded-md object-cover"
                                    />
                                    <p className="text-xs font-medium mt-1">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                            ))}
                        </div>
                    </div> */}

                    <div>
                        <Label>Additional Images</Label>
                        <Input type="file" multiple onChange={(e) => setValue("additional_images", Array.from(e.target.files || []))} />
                    </div>


                    {/* ✅ Color Variants */}
                    <div>
                        <Label>Color Variants</Label>
                        {/* {colorFields.map((color, colorIndex) => (
                            <div key={color.id} className="border p-3 rounded mt-3"> */}
                                {/* ✅ Color Name */}
                                {/* <Label>Color Name</Label>
                                <Input {...register(`color_images.${colorIndex}.color_name`)} placeholder="Enter color name" /> */}

                                {/* <label className="block">
                                    <Label>Up load image</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        {...register(`color_images.${colorIndex}.image`)}
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md "
                                    />
                                </label> */}

                               

                                {/* ✅ Stock Sizes */}
                                {colors.map((colorField, colorIndex) => (
                                    <div key={colorField.id}>
                                        <Label>Color Name</Label>
                                        <Input {...register(`color_images.${colorIndex}.color_name`)} />

                                        <Label>Image URL</Label>
                                        <Input type="file" onChange={(e) => setValue(`color_images.${colorIndex}.image`, e.target.files?.[0] || null)} />

                                        {colorField.stock_sizes.map((stock, stockIndex) => (
                                            <div key={stock.id} className="flex gap-2 mt-2">
                                                <div>
                                                    <Label>Size</Label>
                                                    <Input {...register(`color_images.${colorIndex}.stock_sizes.${stockIndex}.size`)} placeholder="Size" />
                                                </div>
                                                <div>
                                                    <Label>Stock</Label>
                                                    <Input type="number" {...register(`color_images.${colorIndex}.stock_sizes.${stockIndex}.stock`, { valueAsNumber: true })} placeholder="Stock" />
                                                </div>

                                                <Button type="button" variant="destructive" onClick={() => removeStock(stockIndex)}>
                                                    <Trash />
                                                </Button>
                                            </div>
                                        ))}

                                        <Button type="button" onClick={() => addStock(colorIndex)}>
                                            Add Stock Size
                                        </Button>
                                    </div>
                                ))}

                                <Button type="button" variant="destructive" onClick={() => removeColor(colorIndex)} className="mt-2">
                                    <Trash /> Remove Color
                                </Button>
                            {/* </div>
                        ))} */}

                        <Button type="button" variant="outline" onClick={() => addColor({ color_name: "", image: null, stock_sizes: [{ size: "", stock: 0 }] })}>
                            <Plus /> Add Color Variant
                        </Button>
                    </div>

                    <Button type="submit" className="w-full mt-4">
                        Submit Product
                    </Button>
                </form>
            </CardContent>

        </Card>
    );
}

function UploadIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    )
}