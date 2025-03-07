"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchUser, deleteUser } from "./services/api";
import { useEffect, useState } from "react";
import { Users } from "./data/users";
import Link from "next/link";
import EditForm from "./crud/edit";


export default function DataTable() {
  const [users, setUsers] = useState<Users[]>([]);
  const [editingUser, setEditingUser] = useState<Users | null>(null);

  useEffect(() => {
    const loadCustomers = async () => {
      const data = await fetchUser();
      setUsers(data);
    };
    loadCustomers();
  }, []);

  
  // const handleDelete = async (id: number) => {
  //   if (!window.confirm("Are you sure you want to delete this product?"))
  //     return;

  //   try {
  //     await deleteUser(id); // Call API to delete product
  //     setUsers((prev) => prev.filter((user) => user.id !== id));
  //     alert("Product deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting product:", error);
  //     alert("Failed to delete product");
  //   }
  // };

  // const handleEdit = (user: Users) => {
  //   setEditingUser(user);
  // };
  

 
  const columns: ColumnDef<Users>[] = [

    {
      accessorKey: "username",
      header: "Name",
    },

    {
      accessorKey: "deposit",
      header: "Deposit",
      cell: ({ row }) => {
        const latestDeposit = Array.isArray(row.original.deposit)
          ? row.original.deposit[0]?.deposit_amount ?? "N/A"
          : "N/A";
        return latestDeposit.toLocaleString();
      },
    },
    {
      accessorKey: "commission",
      header: "Commission",
      cell: ({ row }) => {
        const latestCommission = Array.isArray(row.original.commission)
          ? row.original.commission[0]?.commission ?? "N/A"
          : "N/A";
        return latestCommission.toLocaleString();
      },
    },

    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
        ${
          row.getValue("is_active")
            ? "bg-green-400 text-gray-800"
            : "bg-red-400 text-red-800"
        }`}
        >
          {row.getValue("is_active") ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      accessorKey: "is_staff",
      header: "Role",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
        ${
          row.getValue("is_staff")
            ? "bg-blue-400 text-gray-800"
            : "bg-gray-400 text-gray-800"
        }`}
        >
          {row.getValue("is_staff") ? "Admin" : "User"}
        </span>
      ),
    },

    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => (
    //     <div className="flex gap-2 justify-center">
    //       <button
    //         onClick={() => handleEdit(row.original)}
    //         className=" py-2 px-2 bg-blue-600 text-white  rounded"
    //       >
    //         Edit
    //       </button>
    //       <button
    //         onClick={() => handleDelete(row.original.id)}
    //         className=" py-2 px-2 bg-red-600 text-white rounded"
    //       >
    //         Delete
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-black">Users</h2>
      
      {editingUser ? (
        <EditForm user={editingUser} />
      ) : (
        <>
          <div className="flex justify-end mb-1">
            <li className="list-none py-2 px-2 text-black bg-green-600 rounded">
              <Link href="/user/create">Add +</Link>
            </li>
          </div>
  
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200 text-black text-xs font-medium">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="border p-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border hover:bg-gray-100">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="border p-2 text-gray-800 text-xs font-medium text-center">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
  
}
