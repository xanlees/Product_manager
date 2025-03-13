"use client"

import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ModeToggle } from "../Theme"

type NavbarContext = {
    open: boolean
    setOpen: (open: boolean) => void
    isMobile: boolean
    toggleNavbar: () => void
}

const NavbarContext = React.createContext<NavbarContext | null>(null)

function useNavbar() {
    const context = React.useContext(NavbarContext)
    if (!context) {
        throw new Error("useNavbar must be used within a NavbarProvider.")
    }
    return context
}

const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
    const isMobile = useIsMobile()
    const [open, setOpen] = React.useState(false)

    const toggleNavbar = () => setOpen((prev) => !prev)

    return (
        <NavbarContext.Provider value={{ open, setOpen, isMobile, toggleNavbar }}>
            {children}
        </NavbarContext.Provider>
    )
}

const Navbar = React.forwardRef<HTMLDivElement, React.ComponentProps<"nav">>(
    ({ className, children, ...props }, ref) => {
        // const { toggleNavbar } = useNavbar()

        return (
            <nav
                ref={ref}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 flex h-16 bg-navbar text-navbar-foreground shadow bg-gray-200 ",
                    className
                )}
                {...props}
            >

                <div className="flex top-0 right-0 w-full items-center justify-between px-4">
                    <ModeToggle />
                    <div className="items-center text-black  justify-between hidden w-full md:flex md:w-auto md:order-1">
                        {children}
                    </div>
  
                </div>
            </nav>
        )
    }
)
Navbar.displayName = "Navbar"

const NavbarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
    ({ className, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("flex flex-1 items-center", className)} {...props} />
        )
    }
)
NavbarContent.displayName = "NavbarContent"

const NavbarItem = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
    ({ className, ...props }, ref) => {
        return <div ref={ref} className={cn("p-2", className)} {...props} />
    }
)
NavbarItem.displayName = "NavbarItem"

const NavbarMenu = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
    ({ className, ...props }, ref) => {
        return (
            <Sheet onOpenChange={() => { }}>
                <SheetContent side="left" className="w-64 bg-navbar text-navbar-foreground">
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                        <SheetDescription>Navigate through the options.</SheetDescription>
                    </SheetHeader>
                    <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />
                </SheetContent>
            </Sheet>
        )
    }
)
NavbarMenu.displayName = "NavbarMenu"

export {
    Navbar,
    NavbarProvider,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    useNavbar,
}
