"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Home, Table, Menu } from "lucide-react"
import { Navbar, NavbarContent, NavbarItem, NavbarMenu, NavbarProvider } from "@/components/ui/navbar"
import { useCart } from "./contexts/cartContext"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"

export function AppNavbar() {
    const router = useRouter()
    const { cartCount } = useCart()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const items = [
        {
            title: "Cart",
            url: "/carts",
            icon: ShoppingCart,
        },
    ]

    return (
        <NavbarProvider>
            <Navbar>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <Menu className="h-4 w-4 " />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* <DropdownMenuLabel>Home</DropdownMenuLabel> */}
                        <DropdownMenuItem onClick={() => router.push("/")}>
                            Home
                        </DropdownMenuItem>
                        {/* <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={() => router.push("/payments")}> Product List</DropdownMenuItem>
                        <DropdownMenuItem></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <NavbarContent>
                    {items.map((item, index) => (
                        <NavbarItem key={index} className="relative flex items-center">
                            <a href={item.url} className="flex items-center gap-2">
                                <item.icon className="w-10 h-6" />
                                {/* <span>{typeof item.title === "string" ? item.title : "Theme"}</span> */}
                            </a>
                            {isClient && item.icon === ShoppingCart && cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0">
                                    {cartCount}
                                </span>
                            )}
                        </NavbarItem>
                    ))}
                </NavbarContent>
                <NavbarMenu />
            </Navbar>
        </NavbarProvider>
    )
}
