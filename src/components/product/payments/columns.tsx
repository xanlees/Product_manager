"use client"

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";


export type Products = {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
    quantity: number;
}


export const columns: ColumnDef<Products>[] = [
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
        enableSorting: true,
    },

    {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
        enableColumnFilter: true,
    },

    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = Number(row.original.price);
            return isNaN(price) ? "N/A" : `₭ ${price.toFixed(2)}`
        },
        enableSorting: true,
    },

    // {
    //   accessorKey: "size",
    //   header: "Size",
    //   enableSorting: true,
    // },

    {
        accessorKey: "color",
        header: "Color",
        enableSorting: true,
        cell: ({ getValue }) => {
            const colorMap: Record<string, { name: string; className: string }> = {
                RED: { name: "RED", className: "text-red-500" },
                GRN: { name: "Green", className: "text-green-500" },
                BLU: { name: "Blue", className: "text-blue-500" },

            };
            const colorInfo = colorMap[getValue() as string] || { name: getValue(), className: "text-gray-500" };

            return <span className={`font-bold ${colorInfo.className}`}>{colorInfo.name}</span>;
        }
    },

    // {
    //   accessorKey: "stock",
    //   header: "Stock",
    //   cell: ({ row }) => {
    //     const stock = Number(row.original.stock);
    //     return (
    //       stock > 0? (
    //         <span className="text-green-500">{stock} in stock</span>
    //       ) : (
    //         <span className="text-red-500">Out of Stock</span>
    //       )
    //     ) 
    //   },
    //   enableSorting: true,
    // },

    // {
    //   accessorKey: "open_date",
    //   header: "Open Date",
    //   cell: ({ row }) => {
    //     const openDate = row.original.lottery_day?.[0]?.lottery_time?.[0]?.open_date ?? null;
    //     return openDate ? new Date(openDate).toLocaleDateString() : "N/A";
    //   },
    // },
    // {
    //   accessorKey: "closing_date",
    //   header: "Closing Date",
    //   cell: ({ row }) => {
    //     const closingDate = row.original.lottery_day?.[0]?.lottery_time?.[0]?.closing_date ?? null;
    //     return closingDate ? new Date(closingDate).toLocaleDateString() : "N/A";
    //   },
    // },

    // {
    //     id: "actions",
    //     header: "Actions",
    //     cell: ({ row }) => (
    //         <div className="flex gap-2 justify-center">
    //             <button onClick={() => handleEdit(row.original)}>
    //                 <LiaEdit className=" text-blue-700 w-5 h-5" />
    //             </button>
    //             <button onClick={() => handleDelete(row.original.id)} className=" ">
    //                 <RiDeleteBin5Line className=" text-red-700 w-5 h-5" />
    //             </button>
    //             <ActionsCell product={row.original} />
    //         </div>
    //     ),
    // },
];