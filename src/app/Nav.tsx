"use client";

import { useCart } from "@/components/product/carts/cartContext";
import ThemeToggle from "@/components/Theme";
import Link from "next/link";
import { BsCart2 } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";

export const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <nav className=" ml-64 flex-1 flex flex-col p-4 justify-between bg-white dark:bg-gray-800 text-black dark:text-white">
        {/* Navbar */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-gray-900 text-white flex items-center px-6 shadow-md">
          <h1 className="flex items-center text-lg font-semibold">
            <MdSpaceDashboard className="mr-2 w-12 h-10" /> Dashboard
          </h1>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />

            <Link
              href="/carts"
              className="relative flex items-center p-2 hover:bg-gray-700 rounded"
            >
              <BsCart2 className="mr-2 text-xl" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Logout Button */}
            <Link
              href="/Login"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
            >
              Login
              <IoLogOutOutline className="mt-1 w-7 h-5" />
            </Link>
          </div>
        </header>
    </nav>
  );
};
