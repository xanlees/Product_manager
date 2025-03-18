"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import ProductActions from "./delete/page";

export type Products = {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
    quantity: number;
}

export const deleteProduct = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/products/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Failed to delete product: ${response.statusText}`);
        }

        window.location.reload()
        return response;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }

};


export const columns: ColumnDef<Products>[] = [
    
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },


    {
        accessorKey: "id",
        header: "ID",
    },

    {
        accessorKey: "image",
        header: "Product",
        cell: ({ row }) => (
            <div className="relative flex items-center justify-center w-28 h-16">
                <Image
                    src={row.original.image}
                    alt="product Avatar"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
        ),
    },

    {
        accessorKey: "description",
        header: "Description",
    },

    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        enableColumnFilter: true,
    },

    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            return <span>{row.original.price} $ </span>
        },
    },

    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;
            return <ProductActions product={product} deleteProduct={deleteProduct} />;
        },
    },

];