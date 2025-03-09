"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchProduct } from "../services/api";
import { Products } from "../data/product";
import Link from "next/link";

export default function ProductAllReview() {
  const [product, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProduct(); // ✅ Fetch products
      setProducts(data);
      setLoading(false);
    };

    loadProducts();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  return (
    <section className="min-h-screen w-full flex justify-center items-center bg-gray-100 p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-black ">
          All Products
        </h1>

        {product.length === 0 ? (
          <p className="text-black text-center">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            {product.map((product) => (
              <Link
                key={`product-${product.id}`}
                href={`/product/${product.id}`}
              >
                <div className="bg-white p-4 shadow-md rounded-lg hover:shadow-xl hover:scale-105 duration-300 cursor-pointer space-y-3">
                  <div className="relative flex justify-center items-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={140}
                      height={100}
                      className="rounded-md w-52 h-70"
                    />
                  </div>
                  <h2 className="text-xl text-gray-400 font-semibold mt-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600">{product.price} ₭</p>
                  {/* <p className="text-sm">
                    {product.stock > 0 ? (
                      <span className="text-green-500">
                        In Stock: {product.stock} 
                      </span>
                    ) : (
                      <span className="text-red-500">Out of Stock</span>
                    )}
                  </p> */}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
