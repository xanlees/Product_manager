"use client";

import "./globals.css";
import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Products } from "@/components/product/data/product";
import { fetchProduct } from "@/components/product/services/api";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

const SHEET_SIDES = ["left"] as const

type HomepageSide = (typeof SHEET_SIDES)[number]

import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Check, SlidersHorizontal } from "lucide-react";

const colorMap: Record<string, { text: string; class: string }> = {
  Red: { text: "Red", class: "text-white bg-red-500 px-2 py-1 rounded-full" },
  Green: { text: "Green", class: "text-white bg-green-500 px-2 py-1 rounded-full" },
  Blue: { text: "Blue", class: "text-white bg-blue-500 px-2 py-1 rounded-full" },
  White: { text: "White", class: " bg-white-100 px-2 py-1 rounded-full dark:bg-gray-50" },
  Black: { text: "Black", class: "text-white bg-black px-2 py-1 rounded-full" },
  Pink: { text: "Pink", class: "text-white bg-pink-600 px-2 py-1 rounded-full" },
  Gray: { text: "Gray", class: "text-white bg-gray-600 px-2 py-1 rounded-full" },
  Yellow: { text: "Yellow", class: "text-white bg-yellow-500 px-2 py-1 rounded-full" },
  Sky: { text: "Sky", class: "text-white bg-sky-600 px-2 py-1 rounded-full" },
  Brown: { text: "Brown", class: " text-white bg-yellow-900 px-2 py-1 rounded-full" },
};


export default function HomepageSide() {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [hoveredColors, setHoveredColors] = useState<{ [key: number]: string | null }>({});
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);;

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

  const handleColorToggle = (color: string) => {
    setSelectedColor((prevSelected) =>
      prevSelected.includes(color)
        ? prevSelected.filter((c) => c !== color) // ✅ Remove if already selected
        : [...prevSelected, color] // ✅ Add if not selected
    );
  };

  const filteredAndSortedProducts = [...products]
    .filter((product) =>
      selectedColor.length > 0 // ✅ Check if any color is selected
        ? product.color_images.some((color) => selectedColor.includes(color.color_name))
        : true // ✅ Show all products if no color is selected
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price; // Low to High
      if (sortOrder === "desc") return b.price - a.price; // High to Low
      return 0; // Default (No Sorting)
    });

  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

 
  return (
    <div className="py-36">
      <div className=" flex absolute right-64 top-20">
        {SHEET_SIDES.map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <span className=" flex cursor-pointer gap-2"> Filters  <SlidersHorizontal className=" mt-1 w-4 h-4"/></span>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle> {/* ✅ Added this for accessibility */}
                <SheetDescription>Select and filter products</SheetDescription>
              </SheetHeader>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                  <AccordionTrigger>Choose a Color {selectedColor.length > 0 && ` (${selectedColor.length})`}</AccordionTrigger>
                    <AccordionContent>
                    <div className="grid grid-cols-3 gap-1">
                      {Object.keys(colorMap).map((color) => (
                        <Button
                          key={color}
                          variant={selectedColor.includes(color) ? "default" : "outline"}
                          onClick={() => handleColorToggle(color)}
                          className={`relative flex items-center justify-center gap-2 ${colorMap[color]?.class || "bg-gray-200 text-black"}`}
                        >
                          {color}

                          {/* ✅ Show ✓ icon if this color is selected */}
                          {selectedColor.includes(color) && <Check className="w-4 h-4 ml-1" />}
                        </Button>
                      ))}
                    </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </SheetContent>
          </Sheet>
        ))}
      </div>
      <div className=" flex absolute right-16 top-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span 
               onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
               className="flex items-center cursor-pointer"
            >
              Short By:
              {sortOrder === "asc" ? (
                <>
                  <ArrowDown className="inline-block w-4 h-4 mr-1 " />
                  <p className=" text-gray-400">Low-High</p>
              
                </>
              ) : (
                <>
                  <ArrowUp className="inline-block w-4 h-4 mr-1 " />
                    <p className=" text-gray-400">High-Low</p>
                </>
              )}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuCheckboxItem
              checked={sortOrder === "asc"}
              onCheckedChange={() => setSortOrder("asc")}
            >
              <span className=" cursor-pointer">Price: Low-Hight</span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={sortOrder === "desc"}
              onCheckedChange={() => setSortOrder("desc")}
            >
              <span className=" cursor-pointer">Price: Hight-Low</span>

            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.length === 0 ? (
          <p className=" absolute top-1/2 left-1/2 text-center text-gray-400">No products available........</p>
        ) : (
            filteredAndSortedProducts.map((product) => {
            const selectedColorImage =
              hoveredColors[product.id] ||
              product.color_images[0]?.image ||
              product.image;

            return (
              <Card
                key={product.id}
                className="w-[350px] hover:shadow-xl hover:scale-105 duration-300 cursor-pointer space-y-3"
                onMouseEnter={() => {
                  if (product.color_images.length > 1) {
                    setHoveredProduct(product.id);
                  }
                }}
                onMouseLeave={() => {
                  if (product.color_images.length > 1) {
                    setHoveredProduct(null);
                  }
                }}
              >
                <CardHeader />

                <CardContent>
                  <Link href={`/product/${product.id}`}>
                    <div className="relative flex flex-col items-center ">
                      {/* ✅ Change only the hovered product's image */}
                      <Image
                        src={selectedColorImage}
                        alt={product.name}
                        width={140}
                        height={100}
                        className="rounded-md w-52 h-70 transition-opacity duration-300"
                      />

                      {/* ✅ Show color options on hover */}
                      {hoveredProduct === product.id ? (
                        <>
                          <div className="mt-2 px-12 flex gap-2 top-full left-0 w-full justify-start items-start">
                            {product.color_images.slice(0, 3).map((color, index) => (
                              <p
                                key={`${product.id}-${color.id}-${index}`}
                                onMouseEnter={() =>
                                  setHoveredColors((prev) => ({
                                    ...prev,
                                    [product.id]: color.image, // ✅ Only change this product
                                  }))
                                }
                                onMouseLeave={() =>
                                  setHoveredColors((prev) => ({
                                    ...prev,
                                    [product.id]: null, // ✅ Reset on mouse leave
                                  }))
                                }
                                className="w-16 h-16 rounded-md border-2 cursor-pointer overflow-hidden"
                              >
                                <Image
                                  src={color.image}
                                  alt={color.color_name}
                                  width={50}
                                  height={50}
                                  className="object-cover w-full h-full rounded"
                                />
                              </p>
                            ))}
                          </div>

                          <p className="mt-2 top-full left-0 w-full text-left px-12 font-semibold">{product.price} $</p>
                        </>
                      ) : (
                        <div className=" top-full left-0 w-full text-left px-12 ">
                          <p className="mt-2 font-semibold">{product.name}</p>
                          <p className="mt-2 ">{`${product.color_images.length} ${product.color_images.length === 1 ? "color" : "colors"}`}</p>
                          <p className="mt-2 font-semibold">{product.price} $</p>
                        </div>
                      )}
                    </div>
                  </Link>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
