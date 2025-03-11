import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from "./Nav";
import { CartProvider } from "@/components/product/carts/cartContext";
import { Provider } from "./providers";

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
    <html lang="en" className="dark:bg-gray-900" suppressHydrationWarning>
      <body
        className={`${inter.className} flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
      >
        <Provider>
          <CartProvider>
            <ToastContainer />
            {/* Sidebar and Navbar */}

            {/* <Sidebar /> */}

            {/* Navbar (Fixed at top) */}
            <Navbar />
            {/* Main Content */}

            <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex-1 p-4">
              {children}
            </main>
          </CartProvider>
        </Provider>
      </body>
    </html>
  );
}
