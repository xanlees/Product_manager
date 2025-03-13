"use client";


import { useCart } from "../../contexts/cartContext";
import Image from "next/image";
import RemoveFromCartButton from "./crud/RemoveFromCartButton";

export default function CartPage() {
  const { cartItems } = useCart();

  return (
    <div className=" flex flex-col items-center justify-center">
      {cartItems.length === 0 ? (
        <p className="text-gray-500 mt-4">Your cart is empty.</p>
      ) : (
        <div className=" mt-6 w-full max-w-full shadow-md rounded-lg p-4 dark:bg-gray-800">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className=" relative flex flex-col justify-start items-start space-x-20 border-b p-3 dark:text-gray-300"
            >
              <div className="flex px-28 justify-start items-start space-x-2 relative ">
                <Image src={item.image} alt={item.name} width={300} height={150} />
                <div className=" px-10 space-y-6">
                  <p className="text-xl font-bold dark:text-gray-200">{item.name}</p>
                  <p className=" dark:text-gray-300">
                    {item.color}
                  </p>
                  <p className="">{item.size}</p>
                  <p className="">Qty: {item.quantity}</p>
                </div>
                <div className="absolute top-0 w-full text-right right-0">
                  <RemoveFromCartButton id={item.id} size={item.size} />
                </div>
              </div>
              <div className=" mt-5 px-8 ">
                <p className="text-2xl font-bold text-right dark:text-gray-300">
                  {new Intl.NumberFormat("en-US", {
                  }).format(
                    cartItems.reduce(
                      (total, item) => item.price,
                      0
                    )
                  )}{" "}
                  $
                </p>
              </div>
            </div>
          ))}
          <p className="text-lg font-bold text-right dark:text-gray-300">
            Total:{" "}
            {new Intl.NumberFormat("en-US", {
            }).format(
              cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              )
            )}{" "}
            $
          </p>
        </div>
      )}
    </div>
  );
}
