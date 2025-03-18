"use client";

import { useCart } from "../../contexts/cartContext";
import Image from "next/image";
import RemoveFromCartButton from "./crud/RemoveFromCartButton";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { cartItems } = useCart();

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const sortedCartItems = [...cartItems].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price; 
    if (sortOrder === "desc") return b.price - a.price; 
    return 0; 
  });
  

  return (
    <div className="relative overflow-x-auto shadow-md ">
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 border rounded-md mr-2"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? (
            <>
              <ArrowUp className="inline-block w-4 h-4 mr-1" />
              High to Low
            </>
          ) : (
            <>
              <ArrowDown className="inline-block w-4 h-4 mr-1" />
              Low to High
            </>
          )}
        </button>
      </div>
      {cartItems.length === 0 ? (
        <p className="text-gray-500 mt-4">Your cart is empty.</p>
      ) : (
        <>
          <table className="w-full text-sm text-center">
            <thead className="text-xs uppercase ">
                <tr className="">
                <th className="border  px-4 py-2 "></th>
                <th className="border  px-4 py-2 "></th>
                <th className="border  px-4 py-2 ">Product</th>
                <th className="border  px-4 py-2 ">Colors</th>
                <th className="border  px-4 py-2 ">
                  Price
                    <button
                      className="ml-2"
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                      {sortOrder === "asc" ? <ArrowUp className="w-4 h-4 inline" /> : <ArrowDown className="w-4 h-4 inline" />}
                    </button>
                </th>
                <th className="border  px-4 py-2 ">Size</th>
                <th className="border  px-4 py-2 ">Quantity</th>
                <th className="border  px-4 py-2 ">Subtotal</th>
              </tr>
            </thead>

            <tbody>
                {sortedCartItems.map((item) => {
                  const colorMap: Record<string, { text: string; class: string }> = {
                    Red: { text: "Red", class: "text-white bg-red-500 px-2 py-1 rounded" },
                    Green: { text: "Green", class: "text-white bg-green-500 px-2 py-1 rounded" },
                    Blue: { text: "Blue", class: "text-white bg-blue-500 px-2 py-1 rounded" },
                    White: { text: "White", class: "text-black bg-gray-100 px-2 py-1 rounded" },
                    Black: { text: "Black", class: "text-white bg-black px-2 py-1 rounded" },
                    Pink: { text: "Pink", class: "text-white bg-pink-600 px-2 py-1 rounded" },
                    Gray: { text: "Gray", class: "text-white bg-gray-600 px-2 py-1 rounded" },
                    Yellow: { text: "Yellow", class: "text-white bg-yellow-500 px-2 py-1 rounded" },
                    Sky: { text: "Sky", class: "text-white bg-sky-600 px-2 py-1 rounded" },
                  };
                  const colorInfo = item?.color && colorMap[item.color] || {
                    text: item?.color || "Unknown",
                    class: "text-gray-500",
                  };

                  return (
                    <tr key={`${item.id}-${item.size}`} className="border-b dark:text-gray-300">
                      <td className="border w-28  px-4 py-2 text-center">
                        <RemoveFromCartButton id={item.id} size={item.size} />
                      </td>
                      <td className="border w-96  px-4 py-2">
                        <Image src={item.image} alt={item.name} width={80} height={50} className="rounded-md" />
                      </td>
                      <td className="border w-96  px-4 py-2 font-bold">{item.name}</td>
                      {/* ✅ Displaying the Color Name */}
                      <td className="border w-48  px-4 py-2">
                        <span className={`text-sm ${colorInfo.class}`}>{colorInfo.text}</span>
                      </td>
                      <td className="border w-32  px-4 py-2">{item.price} $</td>
                      <td className="border w-28  px-4 py-2">{item.size}</td>
                      <td className="border w-48  px-4 py-2 "> <span className=" py-2 px-2 rounded">{item.quantity}</span></td>
                      <td className="border w-28  px-4 py-2 font-bold">
                        {new Intl.NumberFormat("en-US").format(item.price * item.quantity)} $
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          <div className=" text-right mt-2 text-lg font-bold dark:text-gray-300">
            Total:{" "}
            {new Intl.NumberFormat("en-US").format(
              cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
            )}{" "}
            $
          </div>
          </>
      )}
    </div>
  );
}
