"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, StickyNote, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { StockSize } from "../value";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { z } from "zod";

const FormValuesSchema = z.object({
    color_images: z.array(
        z.object({
            color_name: z.string(),
            image: z.string(),
            stock_sizes: z.array(
                z.object({
                    size: z.string(),
                    stock: z.number().min(1, "Stock must be at least 1"),
                })
            ),
        })
    ),
});

type Color_imageForm = z.infer<typeof FormValuesSchema>;

export default function StockForm() {
    const [isOpen, setIsOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<Color_imageForm>({
        resolver: zodResolver(FormValuesSchema),
        defaultValues: {
            color_images: [{ color_name: "", image: "", stock_sizes: [{ size: "", stock: 0 }] }],
        },
    });

    const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
        control,
        name: "color_images",
    });

    const { fields: stockFields, append: appendStock, remove: removeStock } = useFieldArray({
        control,
        name: `color_images.0.stock_sizes`, 
    });


    const onSubmit = (data: Color_imageForm) => {
        console.log(data);
    };

    return (
        <div className="max-h-screen flex justify-center items-center py-10">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger className="flex items-center space-x-2 dark:text-gray-200">
                    {isOpen ? (
                        <X className="w-4 h-4 text-red-500" /> // ❌ Show X icon when open
                    ) : (
                        <Plus className="w-4 h-4 text-green-500" /> // ➕ Show Plus icon when closed
                    )}
                    <p className={`text-sm ${isOpen ? "text-red-500" : "text-gray-800"}`}>
                        {isOpen ? "Hide Add Stock" : "Add Stock"}
                    </p>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <Card className="w-[450px] mt-4">
                        <CardHeader>
                            <CardTitle>Stock Options</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                                <Label>Color Variants</Label>
                                {colorFields.map((color, colorIndex) => (
                                    <div key={color.id} className="border p-3 rounded mt-3">
                                        {/* ✅ Color Name */}
                                        <Label>Color Name</Label>
                                        <Input {...register(`color_images.${colorIndex}.color_name`)} placeholder="Color Name" />
                                        <Label>Image</Label>
                                        <Input {...register(`color_images.${colorIndex}.image`)} placeholder="Image URL" />

                                        {/* ✅ Stock Sizes */}
                                        <Label className="mt-2 block">Stock Sizes</Label>
                                        {stockFields.map((stock, stockIndex) => (
                                            <div key={stock.id} className="flex gap-2 mt-2">
                                                <Input {...register(`color_images.${colorIndex}.stock_sizes.${stockIndex}.size`)} placeholder="Size" />
                                                <Input type="number" {...register(`color_images.${colorIndex}.stock_sizes.${stockIndex}.stock`)} placeholder="Stock" />

                                                <Button type="button" onClick={() => removeStock(stockIndex)} variant="destructive">
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}

                                        <Button type="button" onClick={() => appendStock({ size: "", stock: 0 })} variant="secondary">
                                            Add Size
                                        </Button>

                                        <Button type="button" onClick={() => removeColor(colorIndex)} variant="destructive" className="mt-2">
                                            Remove Color
                                        </Button>
                                    </div>
                                ))}

                                <div className="mt-10 flex justify-start">
                                    <Button
                                        type="button" onClick={() => appendColor({ color_name: "", image: "", stock_sizes: [] })}
                                        variant="secondary"
                                        className="flex items-center text-gray-600 hover:bg-gray-300 px-2 py-1 rounded"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add another option
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
