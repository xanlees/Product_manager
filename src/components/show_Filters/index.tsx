"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ColorImage, Products } from "../product/data/product"
import { useEffect, useState } from "react"
import { fetchProduct } from "../product/services/api"
import { useParams } from "next/navigation"


const SHEET_SIDES = ["left"] as const

type SheetSide = (typeof SHEET_SIDES)[number]

export function SheetSide() {
    const [product, setProducts] = useState<Products[]>([]);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {

            try {
                const data = await fetchProduct();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);


    // const selectedProduct = product.length > 0 ? product[0] : null;

    // const filteredColors = selectedProduct?.color_images?.filter((color) =>
    //     color.color_name.toLowerCase() === "white"
    // );

    // const allColors = selectedProduct?.color_images || [];

    const filteredProducts = selectedColor
        ? product.filter((product) =>
            product.color_images.some((color) => color.color_name.toLowerCase() === selectedColor.toLowerCase())
        )
        : product;

    if (loading) {
        return <p className="text-center text-gray-500">Loading products...</p>;
    }



    return (
        <div className="grid grid-cols-2 gap-2">
            {SHEET_SIDES.map((side) => (
                <Sheet key={side}>
                    <SheetTrigger asChild>
                        <Button variant="outline">{side}</Button>
                    </SheetTrigger>
                    <SheetContent side={side}>
                        <SheetHeader>
                            <SheetTitle>Edit profile</SheetTitle>
                            <SheetDescription>
                                Make changes to your profile here. Click save when done
                            </SheetDescription>
                        </SheetHeader>
                        {loading ? (
                            <p className="text-center text-gray-500">Loading product...</p>
                        ) : product ? (
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Choose a Color</AccordionTrigger>
                                    <AccordionContent>
                                            <div className="flex justify-center gap-4 mb-6">
                                                {["Red", "White", "Black", "Gray"].map((color) => (
                                                    <Button
                                                        key={color}
                                                        variant={selectedColor === color ? "default" : "outline"}
                                                        onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                                                    >
                                                        {color}
                                                    </Button>
                                                ))}
                                            </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ) : (
                            <p className="text-center text-red-500">Product not found.</p>
                        )}
                    </SheetContent>
                </Sheet>
            ))}
        </div>
    )
}
