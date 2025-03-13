"use client"

import { ShoppingCart, Home, Inbox, Search, Settings } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/Theme"
import { useCart } from "./contexts/cartContext";
import { useEffect, useState } from "react";



export function AppSidebar() {
    const { cartCount } = useCart();
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true); 
    }, []);

    const items = [
        {
            title: "Home",
            url: "/",
            icon: Home,
        },
        {
            title: <ModeToggle />,
            url: "#",
            icon: Inbox,
        },
        {
            title: "ShoppingCart",
            url: "/carts",
            icon: ShoppingCart,

        },
        {
            title: "Search",
            url: "#",
            icon: Search,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings,
        },
    ]
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild >
                                        <a href={item.url} >
                                            <item.icon className="relative" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>        
                                    <div className="relative">
                                        {isClient && item.icon === ShoppingCart && cartCount > 0 && (
                                            <span className="absolute -top-7 right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                    {/* <span>{typeof item.title === "string" ? item.title : "Theme"}</span> */}
                                </SidebarMenuItem>
                            ))}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
