import { useState } from "react";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";


interface AddToCartButtonProps {
    handleAddToCart: () => Promise<void>;
    selectedStock: { stock: number } | null; 
    loading: boolean; 
}

export default function AddToCartButton({ handleAddToCart, selectedStock, loading }: AddToCartButtonProps) {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("success"); // "success" or "error"

    const handleClick = async () => {
        if (!selectedStock || selectedStock.stock === 0) {
            setAlertMessage("Out of stock!");
            setAlertType("error");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            return;
        }

        try {
            await handleAddToCart();
            setAlertMessage("Item added to cart.");
            setAlertType("success");
        } catch (error) {
            setAlertMessage("Failed to add item. Try again.");
            setAlertType("error");
        }

        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    return (
        <div className="relative">
            <Button
                onClick={handleClick}
                disabled={!selectedStock || selectedStock.stock === 0 || loading}
                className={`px-4 py-2 text-white rounded-3xl ${!selectedStock || selectedStock.stock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
            >
                {loading
                    ? "Adding..."
                    : !selectedStock || selectedStock.stock === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
            </Button>

            {/* ✅ Alert Component (Shows when button is clicked) */}
            {showAlert && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-full max-w-sm">
                    <Alert className={alertType === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>{alertType === "error" ? "Error!" : "Success!"}</AlertTitle>
                        <AlertDescription>{alertMessage}</AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
}
