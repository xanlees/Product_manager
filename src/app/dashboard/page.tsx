import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true); // Loading state to handle the token check
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to handle authentication

    useEffect(() => {
        // Check if the token exists in localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            // If no token is found, redirect to the login page
            router.push("/login");
        } else {
            // If token exists, the user is authenticated
            setIsAuthenticated(true);
        }

        // After token check, set loading to false
        setIsLoading(false);
    }, [router]);

    if (isLoading) {
        // Show loading state until the token check is completed
        return <div>Loading...</div>;
    }

    return (
        <div>
            {isAuthenticated ? (
                <h1>Welcome to the Dashboard</h1>
            ) : (
                <p>You are not authorized to access this page. Redirecting...</p>
            )}
        </div>
    );
};

export default DashboardPage;
