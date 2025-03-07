import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Link from "next/link";

// icon
import { FaUsers } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { RiProductHuntLine } from "react-icons/ri";
import { BsCart2 } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "A scalable Next.js project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen`}>
        <ToastContainer />
        <aside className="w-64 h-screen bg-gray-800 text-white p-4 fixed left-0 top-0">
          <h2 className="text-lg font-bold flex items-center p-2 hover:bg-gray-700 rounded">
            <RiProductHuntLine className="mr-2 w-20 h-14" />
            Product Management
          </h2>
          <nav>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="flex items-center p-2 hover:bg-gray-700 rounded"
                >
                  <FaHome className="mr-2" />
                  Home
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/user"
                  className=" flex items-center p-2 hover:bg-gray-700 rounded"
                >
                  <FaUsers className="mr-2" />
                  Users
                </Link>
              </li> */}
              {/* <li>
                <Link
                  href="/agent"
                  className=" flex items-center p-2 hover:bg-gray-700 rounded"
                >
                  <MdSupportAgent className="mr-2"  />
                  Agents
                </Link>
              </li> */}
              <Link
                href="/product"
                className=" flex items-center p-2 hover:bg-gray-700 rounded"
              >
                <AiFillProduct className="mr-2" />
                Products
              </Link>
            </ul>
          </nav>
        </aside>
        <div className="ml-64 flex-1 flex flex-col">
          {/* Navbar */}
          <header className="fixed top-0 left-64 right-0 h-16 bg-gray-900 text-white flex items-center px-6 shadow-md">
            <h1 className=" flex items-center text-lg font-semibold">
              <MdSpaceDashboard className=" mr-2 w-12 h-10" /> Dashboard
            </h1>
            <div className="ml-auto flex items-center space-x-4">
              <Link
                href="/carts"
                className=" flex items-center p-2 hover:bg-gray-700 rounded"
              >
                <BsCart2 className="mr-2" />
                Carts
              </Link>
              <Link
                href="/Login"
                className=" flex items-center p-2 hover:bg-gray-700 rounded"
              >
                Login
                <IoLogOutOutline className=" mt-1 w-7 h-5" />
              </Link>
            </div>
          </header>

          {/* Main Content */}
          <main className="mt-16 p-6 flex-1 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
