"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchAgent } from "./services/api";
import { useEffect, useState } from "react";
import { Agents } from "./data/agent";
import Link from "next/link";



export default function AgentTable() {
  const [users, setUsers] = useState<Agents[]>([]);
 
  useEffect(() => {
    const loadCustomers = async () => {
      const data = await fetchAgent();
      setUsers(data);
    };
    loadCustomers();
  }, []);

  
  const columns: ColumnDef<Agents>[] = [

    {
      accessorKey: "username",
      header: "Name",
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
  ];

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-black">Users</h2>
      <div className=" flex justify-end mb-1  ">
        <li
          className=" list-none py-2 px-2 text-black bg-green-600 rounded"
        > <Link href="/agent/create" >
            Add +
        </Link>
        </li>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200 text-black text-xs font-medium ">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border p-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-4 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border p-2 text-gray-800 text-xs font-medium  text-center "
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
