"use client";

import { useCartStore } from "./carStore";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCartStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-black">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 mt-4">Your cart is empty.</p>
      ) : (
        <div className="mt-6 w-full max-w-full bg-white shadow-md rounded-lg p-4">
          {cart.map((item) => (
            <div key={item.id} className="flex w-full justify-between space-x-20 items-center border-b p-3">
              <img src={item.image} alt={item.name} className="w-28 h-16 object-cover" />
              <p className="text-lg font-bold text-black">{item.name}</p>
              <p className="text-blue-500">{item.price} ₭</p>
              <p className="text-gray-700">Qty: {item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="w-full bg-red-500 text-white py-2 mt-4 rounded hover:bg-red-600"
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
}
