"use client"

import { useState } from "react";
import { Products } from "../../data/product";
import { deleteProduct } from "../../services/api";

export const Delete = () => {

    const [users, setUsers] = useState<Products[]>([]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this product?"))
            return;

        try {
            await deleteProduct(id); // Call API to delete product
            setUsers((prev) => prev.filter((product) => product.id !== id));
            alert("Product deleted successfully");
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        }
    };

    return (
        <div>
            <h2>Delete Product</h2>
            <ul>
                {users.map((product) => (
                    <li key={product.id}>
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );

}