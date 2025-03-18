
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "@/components/contexts/cartContext";
import { NavbarProvider } from "@/components/ui/navbar";
import { AppNavbar } from "@/components/app-navbar";
import { ThemeProvider } from "@/app/providers";

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
        <html lang="en" className="" suppressHydrationWarning>
            <body className={`${inter.className} flex h-screen bg-whitee`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <CartProvider>
                        <ToastContainer />
                        <NavbarProvider>
                            <AppNavbar />
                            <main className=" flex min-h-screen flex-col w-full px-4 md:px-8 lg:px-16">
                                {children}
                            </main>
                        </NavbarProvider>
                    </CartProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
