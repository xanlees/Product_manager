"use client";

import { useProductStore } from "../../data/product";
import { useCartStore } from "../../carts/carStore";
import { useState } from "react";

export default function ProductReview() {
  const product = useProductStore((state) => state.selectedProduct);
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const colorMap: Record<string, { text: string; class: string }> = {
    RED: { text: "Red", class: "text-red-500" },
    GRN: { text: "Green", class: "text-green-500" },
    BLU: { text: "Blue", class: "text-blue-500" },
  };

  const colorInfo = colorMap[product?.color || ""] || {
    text: product?.color || "Unknown",
    class: "text-gray-500",
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-black">
        <h1 className="text-2xl font-bold">No Product Selected</h1>
        <p className="text-lg mt-2">Please select a product to review.</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (quantity < 1) return;

    setLoading(true);

    const cartItem = {
      id: product.id, 
      name: product.name,
      price: product.price,
      quantity,
      color: product.color,
      size: product.size,
      image: product.image,
    };

    try {
      // Save to local store (fix: use correct id format)
      addToCart(cartItem);

      // Send request to Django backend
      const response = await fetch("http://localhost:8000/api/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ Ensure JSON request
          Accept: "application/json", // ✅ Ensure response is JSON
        },
        body: JSON.stringify({
          product_id: product.id, // Keep "product_id" for Django
          name: product.name,
          price: product.price,
          quantity,
          color: product.color,
          size: product.size,
          image: product.image,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();
      console.log("Cart response:", data);

      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className=" bg-gray-100 flex justify-center items-center">
        <div className=" grid max-w-full gap-4 p-4 md:grid-cols-1 ">
          <article className=" py-7 px-10 rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300">
            <a href="#">
              <div className="relative flex overflow-hidden rounded-xl justify-center items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-56 h-32 object-cover"
                />
              </div>
              <div className="mt-10 p-2 ">
                <div className=" ">
                  <h2 className="text-slate-700 text-4xl font-bold">
                    {product.name}
                  </h2>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 items-end">
                  <div className="w-1/2">
                    <p>
                      <span className="text-lg font-bold text-blue-500">
                        {product.price} ₭
                      </span>
                    </p>
                  </div>
                  <div className="w-1/2">
                    <p>
                      <span
                        className={`text-sm font-bold ${
                          product.size === "S"
                            ? "text-gray-500"
                            : product.size === "M"
                            ? "text-blue-500"
                            : "text-orange-500"
                        }`}
                      >
                        {product.size}
                      </span>
                    </p>
                  </div>
                  <div className="w-1/2">
                    <p>
                      <span className={`text-sm font-bold ${colorInfo.class}`}>
                        {colorInfo.text}
                      </span>
                    </p>
                  </div>
                  <div className="w-1/2">
                    <p>
                      <span className="text-sm font-bold text-blue-500">
                        Stock: {product.stock}
                      </span>
                    </p>
                  </div>
                  <div className="w-full flex flex-col items-center mt-4">
                    <label className="text-sm font-medium text-gray-700">
                      Quantity:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-16 text-center border rounded-md px-2 py-1 text-gray-700"
                    />
                  </div>
                  <div className="w-full flex justify-center mt-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={loading}
                      className={`flex items-center space-x-1.5 rounded-lg px-4 py-1.5 text-white duration-100 ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-sm`}
                    >
                      {loading ? "Adding..." : "Add to cart"}
                    </button>
                  </div>
                </div>
              </div>
            </a>
          </article>
        </div>
      </section>
    </>
  );
}
