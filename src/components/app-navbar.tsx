"use client"

import * as React from "react"
import { ShoppingCart } from "lucide-react"
import { Navbar, NavbarContent, NavbarItem, NavbarMenu, NavbarProvider } from "@/components/ui/navbar"
import { useCart } from "./contexts/cartContext"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuTypeTrigger,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"

export function AppNavbar() {
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

    const components: { title: string; href: string; }[] = [
        {
            title: "Home",
            href: "/",
        },
        {
            title: "Product List",
            href: "/payments",
        },
    ]

    return (
        <NavbarProvider>
            <Navbar>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTypeTrigger></NavigationMenuTypeTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[100px] gap-2 p-1 md:w-[200px] md:grid-cols-1 lg:w-[150px] ">
                                    {components.map((component) => (
                                        <ListItem
                                            key={component.title}
                                            title={component.title}
                                            href={component.href}
                                        >
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
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

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"