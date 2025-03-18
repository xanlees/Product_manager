import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ProtectedPage = () => {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (!storedRole) {
            router.push("/");  
        } else {
            setRole(storedRole);
        }
    }, [router]);

    return role ? (
        <div>
            <h1>Welcome, {role === "admin" ? "Admin" : "User"}</h1>
        </div>
    ) : (
        <div>Loading...</div>
    );
};

export default ProtectedPage;
