"use client";
import { useForm } from "react-hook-form";
import { Products } from "../../data/product";
import { useEffect, useState } from "react";
import { updateProduct } from "../../services/api";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

const choices_Size = [
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
];

const choices_Color = [
  { value: "RED", label: "red" },
  { value: "BLU", label: "blue" },
  { value: "GRN", label: "green" },
];

export default function EditForm({ product }: { product: Products }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Products>({
    defaultValues: product,
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setPreview(reader.result as string);
    //   };
    //   reader.readAsDataURL(file);
    // }
  };

  useEffect(() => {
    if (product?.image) {
      setPreview(product.image);
    }
  }, [product]);

  const onSubmit = async (data: Products) => {
    setLoading(true);

    console.log("Form data before submitting:", data);

    if (!data.id) {
      alert("Product ID is missing!");
      setLoading(false);
      return;
    }

    const file = data.image[0];

    if (!file) {
      alert("Please upload an image.");
      setLoading(false);
      return;
    }

    // Create FormData object
    const formData = new FormData();
    // const translations = {
    //   en: {name: data.name},
    // }
    // formData.append("translations", JSON.stringify(translations));
    formData.append(
      "translations",
      JSON.stringify({ en: { name: data.name } })
    );
    formData.append("description", String(data.description));
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("size", String(data.size));
    formData.append("color", String(data.color));

    if (selectedFile) {
      formData.append("image", selectedFile);
    } else if (product?.image) {
      formData.append("image", product.image);
    }

    try {
      const response = await updateProduct(formData, data.id);
      console.log("Product created successfully:", response);
      toast.success("Product updated successfully! 🎉", {
        position: "top-right",
        autoClose: 3000,
      });


    } catch (err) {
      console.log("Error updating", err);
      toast.error("Failed to update product. ❌", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mt-32 min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* <div>
          <button
            onClick={() => router.push("/product")}
            className="bg-gray-100 border border-sky-700 text-white py-2 px-4 rounded"
          >
            <IoIosArrowBack className="w-6 h-4 text-sky-700" />
          </button>
        </div> */}

        <div className=" mt-2 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 p-4 border rounded"
          >
            <div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <label className="block">
                  <span className="text-gray-700">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    onChange={handleFileChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md text-black"
                  />
                </label>

                {errors.image && (
                  <p className="text-red-500">{errors.image.message}</p>
                )}

                {preview && (
                  <div className="mt-4">
                    <p className="text-black">Current Image:</p>
                    <img src={preview} alt="Preview" className="w-24 h-16 " />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 -mx-3 flex flex-wrap ">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="Product"
                    className="block text-sm font-medium leading-5 text-gray-700"
                  >
                    Product name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    placeholder="Name"
                    className="border p-2 w-full text-black border-sky-500 rounded-lg"
                  />
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium leading-5 text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    {...register("price", { required: "price is required" })}
                    placeholder="Price"
                    type="number"
                    className="border p-2 w-full text-black border-sky-500 rounded-lg"
                  />
                  {errors.price && (
                    <p className="text-red-500">{errors.price.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Description
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <textarea
                  id="description"
                  {...register("description", {
                    required: "description is required",
                    minLength: 10,
                  })}
                  className="w-full p-2 border text-black border-sky-500 rounded-lg"
                  rows="2"
                  placeholder="Type your description..."
                />
                {errors.description?.message && (
                  <p className="text-red-500">{errors.description.message}</p>
                )}
              </div>
            </div>
            <div className="mt-2">
              <label
                htmlFor="stock"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Stock
              </label>
              <div className="mt-1 rounded-lg shadow-sm">
                <input
                  {...register("stock", { required: "stock is required" })}
                  placeholder="Stock"
                  type="number"
                  className="border p-2 w-full text-black border-sky-500 rounded-lg"
                />
                {errors.stock && (
                  <p className="text-red-500">{errors.stock.message}</p>
                )}
              </div>
            </div>
            <div className=" mt-2 -mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="size"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Size
                  </label>
                  <select
                    {...register("size", { required: true })}
                    className="mt-1 block w-full border p-2  text-black border-sky-500 rounded-lg"
                  >
                    {choices_Size.map((choice) => (
                      <option key={choice.value} value={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="Colors"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Colors
                  </label>
                  <select
                    {...register("color", { required: true })}
                    className="mt-1 block w-full border p-2  text-black border-sky-500 rounded-lg"
                  >
                    {choices_Color.map((choice) => (
                      <option key={choice.value} value={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="">
              <span className="block w-full rounded-md shadow-sm">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-green-400 text-black py-3 px-4 rounded"
                >
                  {loading ? "Editting..." : "Edit Product"}
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
