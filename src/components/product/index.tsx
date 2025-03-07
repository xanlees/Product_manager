"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import Link from "next/link";
import EditForm from "./crud/edit";
import { Products, useProductStore } from "./data/product";
import Image from "next/image";
import { deleteProduct, fetchProduct } from "./services/api";

import { LiaEdit } from "react-icons/lia";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdAddShoppingCart } from "react-icons/md";

import { MdNavigateNext } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { BiShow } from "react-icons/bi";
import { useRouter } from "next/navigation";


export default function Product() {
  const [users, setUsers] = useState<Products[]>([]);
  const [editingproduct, setEditingUser] = useState<Products | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      const data = await fetchProduct();
      setUsers(data);
    };
    loadCustomers();
  }, []);

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

  const handleEdit = (product: Products) => {
    setEditingUser(product);
  };

  const ActionsCell = ({ product }: { product: Products }) => {
    const router = useRouter();
    const setProduct = useProductStore((state) => state.setProduct);

    return (
      <button
        onClick={() => {
          setProduct(product); // ✅ Store product in Zustand
          router.push(`/product/show`); // ✅ Navigate to review page
        }}
      >
        <BiShow className=" text-teal-700 w-5 h-5" />
      </button>
    );
  };

  const columns: ColumnDef<Products>[] = [
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

    {
      accessorKey: "size",
      header: "Size",
      enableSorting: true,
    },

    {
      accessorKey: "color",
      header: "Color",
      enableSorting: true,
      cell : ({getValue}) => {
        const colorMap: Record<string, {name:string; className: string}> = {
          RED: { name: "RED", className: "text-red-500" },
          GRN: { name: "Green", className: "text-green-500" },
          BLU: { name: "Blue", className: "text-blue-500" },
          
        };
        const colorInfo = colorMap[getValue() as string] || { name: getValue(), className: "text-gray-500" };

        return <span className={`font-bold ${colorInfo.className}`}>{colorInfo.name}</span>;
      }
    },

    {
      accessorKey: "stock",
      header: "Stock",
      enableSorting: true,
    },

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

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <button onClick={() => handleEdit(row.original)}>
            <LiaEdit className=" text-blue-700 w-5 h-5" />
          </button>
          <button onClick={() => handleDelete(row.original.id)} className=" ">
            <RiDeleteBin5Line className=" text-red-700 w-5 h-5" />
          </button>
          <ActionsCell product={row.original} />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-black">Product</h2>

      {editingproduct ? (
        <EditForm product={editingproduct} />
      ) : (
        <>
          <div></div>
          <div className="flex justify-end space-x-5 mb-1">
            <input
              type="text"
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="p-2 border mb-2 rounded-lg text-black"
            />
            <li className="list-none mt-1">
              <Link href="/product/create">
                <MdAddShoppingCart className=" w-9 h-9 text-green-700" />
              </Link>
            </li>
          </div>

          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200 text-black text-sm font-medium">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border p-2 cursor-pointer "
                      onClick={header.column.getToggleSortingHandler()} // ✅ Click to sort
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc"
                        ? " 🔼"
                        : header.column.getIsSorted() === "desc"
                        ? " 🔽"
                        : ""}
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
                        className="border p-2 text-gray-800 text-xs font-medium text-center"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 border text-black"
            >
              <IoIosArrowBack className="w-6 h-4 text-red-700" />
            </button>
            <span className="text-black">
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 border text-black"
            >
              <MdNavigateNext className=" w-7 h-5 text-red-700" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
