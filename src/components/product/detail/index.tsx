"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation"; // ✅ Get product ID from URL
import Image from "next/image";
import { Products } from "../data/product";
import { useCart } from "../carts/cartContext";
import { fetchProduct } from "../services/api";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ProductDetail() {
  const { id } = useParams(); // ✅ Get product ID from URL
  const [product, setProducts] = useState<Products | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  // const availableSizes = ["S", "M", "L", "XL"];
  // const [selectedSize, setSelectedSize] = useState(availableSizes[0]);

  const [sizeStock, setSizeStock] = useState<{ [key: string]: number }>({});
  const [selectedSize, setSelectedSize] = useState("40");

  // const [currentIndex, setCurrentIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // const thumbnailsToShow = 3;

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProduct();
        const selectedProduct = data.find((p: Products) => p.id === Number(id));

        if (selectedProduct) {
          setProducts(selectedProduct);
          setSelectedImage(
            selectedProduct.image.startsWith("http")
              ? selectedProduct.image
              : `http://localhost:8000${selectedProduct.image}`
          );
          setSizeStock(selectedProduct.size_stock);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [id]);

  if (loading || !product) {
    return <p className="text-center text-gray-500">Loading product...</p>;
  }

  const images = [
    product.image.startsWith("http")
      ? product.image
      : `http://localhost:8000${product.image}`,
    ...(Array.isArray(product.additional_images)
      ? product.additional_images.map((img) =>
          img.startsWith("http") ? img : `http://localhost:8000${img}`
        )
      : []),
  ].filter(Boolean);

  // const goToNext = () => {
  //   const newIndex = (currentIndex + 1) % images.length;
  //   setCurrentIndex(newIndex);
  //   setSelectedImage(images[newIndex]);
  // };

  // const goToPrev = () => {
  //   const newIndex = (currentIndex - 1 + images.length) % images.length;
  //   setCurrentIndex(newIndex);
  //   setSelectedImage(images[newIndex]);
  // };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 120; // Adjust based on thumbnail width
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 120; // Adjust based on thumbnail width
    }
  };

  const handleAddToCart = async () => {
    if (quantity < 1 || quantity > product.stock) {
      alert("Invalid quantity!");
      return;
    }

    setLoading(true);

    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      color: product.color,
      size: selectedSize,
      image: product.image,
    };

    addToCart(newItem);

    try {
      // ✅ Reduce stock in backend
      const stockUpdateResponse = await fetch(
        `http://localhost:8000/api/v1/products/${product.id}/reduce_stock/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ stock: quantity }),
        }
      );

      if (!stockUpdateResponse.ok) {
        throw new Error("Failed to update stock");
      }

      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-6">
      <div className="bg-white text-gray-700 p-6 rounded-lg shadow-lg max-w-full w-full">
        {/* ✅ Image Preview */}
        <div className="relative flex justify-center items-center">
          {/* <button
            onClick={goToPrev}
            className="absolute left-0 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button> */}

          <Image
            src={hoveredImage || selectedImage}
            alt="Selected Product"
            width={260}
            height={230}
            className="rounded-md w-52 h-60 border"
          />

          {/* <button
            onClick={goToNext}
            className="absolute right-0 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          >
            <FaChevronRight className="w-5 h-5" />
          </button> */}
        </div>

        <div className="mt-3 flex gap-2 justify-center items-center">
          <button
            onClick={scrollLeft}
            // disabled={startIndex === 0}
            className=" h-10 w-8 p-2 text-white rounded disabled:opacity-50"
          >
            <FaChevronLeft className="w-5 h-5 text-gray-600 hover:text-sky-700" />
          </button>
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-scroll no-scrollbar scroll-smooth w-64 mx-auto"
          >
            {images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={80}
                height={60}
                className="cursor-pointer rounded border hover:border-blue-500"
                onMouseEnter={() => setHoveredImage(img)}
                onMouseLeave={() => setHoveredImage(null)}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
          {/* <Image
            src={product.image}
            alt="Main Image"
            width={80}
            height={60}
            className="cursor-pointer rounded border hover:border-blue-500"
            onClick={() => setSelectedImage(product.image)}
          /> */}
          {/* 
          {images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              width={80}
              height={60}
              className="cursor-pointer rounded border hover:border-blue-500"
              onMouseEnter={() => setHoveredImage(img)}
              onMouseLeave={() => setHoveredImage(null)}
              onClick={() => setSelectedImage(img)}
            />
          ))} */}

          <button
            onClick={scrollRight}
            // disabled={startIndex + thumbnailsToShow >= images.length}
            className=" h-10 w-8 p-2 rounded text-white disabled:opacity-50 z-10"
          >
            <FaChevronRight className="w-5 h-5 text-gray-700 hover:text-sky-700" />
          </button>
        </div>

        <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.price} ₭</p>
        {/* <p className="text-gray-600">Size:</p>
        <div className="mt-2 flex gap-2">
          {availableSizes.map((size) => (
            <div
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 border rounded-md cursor-pointer ${
                selectedSize === size
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-blue-400 hover:text-white`}
            >
              {size}
            </div>
          ))}
        </div> */}

        <div className="flex items-center justify-center mt-2">
          <label className="mr-2 text-gray-600">Qty:</label>

          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={quantity === 1}
            className={`px-2 w-8 border bg-slate-100 ${
              quantity === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-300"
            }`}
          >
            -
          </button>

          <span className="px-4 py-1 bg-white">{quantity}</span>

          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            disabled={product.stock <= 0} // ✅ Only disable when stock is 0
            className={`px-2 w-8 border bg-slate-100 ${
              product.stock <= 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-300"
            }`}
          >
            +
          </button>
          <p className="px-2 text-gray-300">Stock:</p>
          <span
            className={`text-gray-300 ${
              product.stock <= 0
                ? "text-red-500"
                : product.stock === 1
                ? "text-yellow-500"
                : ""
            }`}
          >
            {product.stock === 1
              ? "One left in stock" // ✅ Show message when 1 left
              : Math.max(0, product.stock - quantity)}
          </span>
        </div>
        <div className="flex items-center justify-center mt-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || loading}
            className={`mt-4 px-4 py-2 text-white rounded-md ${
              product.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading
              ? "Adding..."
              : product.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
