"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);  // Track loading state
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Error accessing localStorage", error);
                router.push("/login"); // Redirect if there's an error
            } finally {
                setIsLoading(false);
            }
        }
    }, [router]);

    if (isLoading) {
        // Show loading state while checking for token
        return <div>Loading...</div>;
    }

    return (
        <div>
            {isAuthenticated ? (
                <h1>Welcome to the Home Page</h1>
            ) : (
                // Optionally handle the case if no token is found
                <p>You are being redirected to the login page...</p>
            )}
        </div>
    );
}
