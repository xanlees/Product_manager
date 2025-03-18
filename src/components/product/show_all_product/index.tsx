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

export default function Page() {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [hoveredColors, setHoveredColors] = useState<{ [key: number]: string | null }>({});

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

  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  return (
    <div className="py-36">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          products.map((product) => {
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
