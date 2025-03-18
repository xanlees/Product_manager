"use client";

import { useEffect, useState } from "react";
import { ColorImage, useProductStore } from "../../data/product";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductReview() {
  const product = useProductStore((state) => state.selectedProduct);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorImage | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");


  useEffect(() => {
    setSelectedColor(product?.color_images?.[0] || null);

    const defaultColor = product?.color_images?.[0] || null;
    if (defaultColor && defaultColor.stock_sizes.length > 0) {
      setSelectedSize(defaultColor.stock_sizes[0].size);
    }
  }, [product]);

  const selectedStock = selectedColor?.stock_sizes.find(
    (stock) => stock.size === selectedSize
  );

  const handleColorChange = (color: ColorImage) => {
    setSelectedColor(color);
    setSelectedImage(color.image);

  };


  // const colorMap: Record<string, { text: string; class: string }> = {
  //   RED: { text: "Red", class: "text-red-500" },
  //   GRN: { text: "Green", class: "text-green-500" },
  //   BLU: { text: "Blue", class: "text-blue-500" },
  // };

  // const colorInfo = colorMap[product?.color || ""] || {
  //   text: product?.color || "Unknown",
  //   class: "text-gray-500",
  // };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold">No Product Selected</h1>
        <p className="text-lg mt-2">Please select a product to review.</p>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
        <Card className="max-w-4xl w-full p-6 rounded-xl shadow-lg">
          <CardHeader className=" realative flex flex-col justify-center items-center">
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={150}
              className="rounded-xl"
            />
            
            
            <CardTitle className="text-center text-2xl mt-4">{product.name}</CardTitle>
            <CardDescription className="text-center text-gray-600">
              {product.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className=" flex flex-col justify-center items-center space-y-4">
              {/* Price */}
              <p className="text-xl font-bold text-gray-600">{product.price} $</p>
              <div className="flex justify-center">
                <div className=" flex gap-2 flex-wrap justify-center ">
                  {product.color_images.length > 0 ? (
                    product.color_images.map((color) => (
                      <span
                        key={color.id || color.color_name}
                        onClick={() => handleColorChange(color)}
                        className={`w-16 h-16 rounded border-2 cursor-pointer hover:border-gray-600 ${selectedColor?.id === color.id ? "border-gray-200" : "border-gray-300"
                          }`}
                      >
                        <Image 
                          src={color.image}
                          alt={color.color_name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full rounded"
                        />
                      </span>
                    ))
                  ) : (
                    <p className="text-red-500">No colors available</p>
                  )}
                </div>
              </div>
              {/* Size Options */}
              <div className="flex gap-2">
                {selectedColor?.stock_sizes.length > 0 ? (
                  selectedColor.stock_sizes.map((stock) => (
                    <button
                      key={stock.id || stock.size}
                      onClick={() => setSelectedSize(stock.size)}
                      className={`px-4 py-2 border rounded-md cursor-pointer ${selectedSize === stock.size ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700"
                        } hover:bg-gray-400 hover:text-white`}
                    >
                      {stock.size}
                    </button>
                  ))
                ) : (
                  <p className="text-red-500">No sizes available</p>
                )}
              </div>

              {/* Stock Information */}
              <p className="text-gray-700">
                Stock:{" "}
                <span className={selectedStock?.stock === 0 ? "text-red-600" : "text-green-600"}>
                  {selectedStock?.stock || 0} {selectedStock?.stock === 1 ? "left" : "available"}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
