"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootClientLayout({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true); // Set true initially
    const router = useRouter();

    useEffect(() => {
        // Check if token exists directly in useEffect
        const token = localStorage.getItem("token");
        console.log("Checking token in useEffect:", token);

        if (!token) {
            // If no token found, redirect to login
            console.log("No token found, redirecting to login.");
            router.push("/login");
        } else {
            // If token exists, stop loading
            console.log("Token found, setting loading to false.");
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) {
        return <div>Loading...</div>;  // Show loading state while checking
    }

    return <>{children}</>;  // Render children once loading is complete and token is validated
}
