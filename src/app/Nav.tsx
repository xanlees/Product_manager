"use client";

import { useCart } from "@/components/contexts/cartContext";
import { ModeToggle } from "@/components/Theme";
import Link from "next/link";
import { AiFillProduct } from "react-icons/ai";
import { BsCart2 } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { RiProductHuntLine } from "react-icons/ri";

export const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a className="flex items-center space-x-3 rtl:space-x-reverse">
          <h2 className=" font-bold text-xl flex items-center p-2 text-gray-900 rounded-lg dark:text-white group">
            <RiProductHuntLine className="mr-2 w-20 h-14 text-gray-200 transition duration-75 dark:text-gray-400  " />
            Product Store
          </h2>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-2 rtl:space-x-reverse">
          <ModeToggle />
          <Link
            href="/carts"
            className="relative flex items-center p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded"
          >
            <BsCart2 className="mr-2 text-xl" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/Login"
            className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded"
          >
            Login
            <IoLogOutOutline className="mt-1 w-7 h-5" />
          </Link>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                href="/"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaHome className="mr-2 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/payments"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <AiFillProduct className="mr-2 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
