"use client";

import { RiDeleteBin5Line } from "react-icons/ri";
import { useCart } from "./cartContext";
import Image from "next/image";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  return (
    <div className=" flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-black">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 mt-4">Your cart is empty.</p>
      ) : (
        <div className="mt-6 w-full max-w-full bg-white shadow-md rounded-lg p-4">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex w-full justify-between space-x-20 items-center border-b p-3"
            >
              <Image src={item.image} alt={item.name} width={100} height={90} />
              <p className="text-lg font-bold text-black">{item.name}</p>
              <p className="text-blue-500">{item.price} ₭</p>
              <p className="text-blue-500">{item.size}</p>
              <p className="text-gray-700">Qty: {item.quantity}</p>
              <button onClick={() => removeFromCart(item.id, item.size)}>
                <RiDeleteBin5Line className=" text-red-700 w-5 h-5" />
              </button>
            </div>
          ))}
          {/* <button
            onClick={clearCart}
            className="w-full bg-red-500 text-white py-2 mt-4 rounded hover:bg-red-600"
          >
            Clear Cart
          </button> */}
        </div>
      )}
    </div>
  );
}
