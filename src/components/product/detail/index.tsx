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
  const [zoomed, setZoomed] = useState(false);

  // const availableSizes = ["S", "M", "L", "XL"];
  // const [selectedSize, setSelectedSize] = useState(availableSizes[0]);

  const [sizeStock, setSizeStock] = useState<{ [key: string]: number }>({});
  const [selectedSize, setSelectedSize] = useState("40");
  const [selectedColor, setSelectedColor] = useState<string>("");

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
          setSizeStock(selectedProduct.sizes);
          setSelectedSize(Object.keys(selectedProduct.sizes)[0]);
          setSelectedColor(Object.keys(selectedProduct.color)[0]);
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

  const handleColorChange = (colors: string) => {
    setSelectedColor(colors);
    setSelectedImage(product.color[colors]); // ✅ Update image based on color
  };

  // const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (!e.currentTarget) return;

  //   const { left, top, width, height } =
  //     e.currentTarget.getBoundingClientRect();
  //   const x = ((e.clientX - left) / width) * 100;
  //   const y = ((e.clientY - top) / height) * 100;

  //   setZoomPosition({ x, y });
  //   setIsHovering(true);
  // };

  // const handleMouseLeave = () => {
  //   setIsHovering(false);
  // };

  const handleAddToCart = async () => {
    if (quantity < 1 || quantity > sizeStock[selectedSize]) {
      alert("Invalid quantity!");
      return;
    }

    setLoading(true);

    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      color: selectedSize,
      size: selectedSize,
      image: product.image,
    };

    addToCart(newItem);

    try {
      // ✅ Reduce stock in backend
      const response = await fetch(
        `http://localhost:8000/api/v1/products/${product.id}/reduce_stock/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            size: selectedSize, // ✅ Correct key
            quantity: quantity, // ✅ Correct key
          }),
        }
      );

      const jsonResponse = await response.json();

      if (!response.ok)
        throw new Error(jsonResponse.error || "Failed to update stock");

      alert("Product added to cart successfully!");

      setSizeStock((prevStock) => ({
        ...prevStock,
        [selectedSize]: Math.max(0, prevStock[selectedSize] - quantity), // ✅ Reduce only selected size stock
      }));
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
        <div className="relative flex flex-col items-center">
          <div className=" relative border rounded-md overflow-hidden w-52 h-60 cursor-zoom-in">
            {/* <button
            onClick={goToPrev}
            className="absolute left-0 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button> */}

            <Image
              src={selectedImage}
              alt="Selected Product"
              width={260}
              height={230}
              className="transition-transform duration-300 ease-in-out"
              onClick={() => setZoomed(true)}
            />

            {/* <button
            onClick={goToNext}
            className="absolute right-0 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          >
            <FaChevronRight className="w-5 h-5" />
          </button> */}
          </div>
        </div>

        {/* {isHovering && zoomPosition && (
          <div className="absolute left-full top-0 ml-6 w-64 h-64 border rounded-lg shadow-lg overflow-hidden bg-white">
            <div className="relative w-[800px] h-[800px] overflow-hidden">
              <Image
                src={product.image}
                alt="Zoomed Product"
                fill
                className="absolute"
                style={{
                  transform: `translate(-${zoomPosition.x}%, -${zoomPosition.y}%) scale(2)`,
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
            </div>
          </div>
        )} */}
        {zoomed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setZoomed(false)} // ✅ Click outside to close
          >
            <Image
              src={selectedImage}
              alt="Zoomed Image"
              width={800} // ✅ Larger width
              height={600} // ✅ Larger height
              className="rounded-lg shadow-lg"
            />
          </div>
        )}

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
                className={`cursor-pointer rounded border ${
                  selectedImage === img
                    ? "border-blue-500"
                    : "hover:border-blue-500"
                }`}
                onMouseEnter={() => setSelectedImage(img)}
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
        {/* <p className="text-gray-600 mt-4">Color:</p>
        <div className="mt-2 flex gap-2">
          {Object.keys(product.color).map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color ? "border-blue-500" : "border-gray-300"
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
        </div> */}
        <p className="text-gray-600 mt-4">Color:</p>
        <div className="mt-2 flex gap-2">
          {Object.entries(product.color).map(([colorName, colorImage]) => {
            const imageUrl = colorImage.startsWith("http")
              ? colorImage
              : `http://localhost:8000${colorImage}`; // ✅ Ensure a full URL

            return (
              <button
                key={colorName}
                onClick={() => setSelectedImage(imageUrl)}
                className={`w-16 h-16 rounded-md border-2 overflow-hidden ${
                  selectedImage === imageUrl
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                <Image
                  src={imageUrl} // ✅ Show correct image URL
                  alt={colorName}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
              </button>
            );
          })}
        </div>
        <p className="text-gray-600 mt-2">{product.price} $</p>
        <p className="text-gray-600">Size:</p>
        <div className="mt-2 flex gap-2">
          {Object.keys(product.sizes || {}).map((size) => (
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
        </div>

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
            onClick={() =>
              setQuantity((prev) => Math.min(sizeStock[selectedSize], prev + 1))
            }
            disabled={sizeStock[selectedSize] <= 0}
            className={`px-2 w-8 border bg-slate-100 ${
              sizeStock[selectedSize] <= 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-300"
            }`}
          >
            +
          </button>
          {/* <p className=" px-2 text-gray-300">Stock:</p>
          <span
            className={
              product.size_stock[selectedSize] === 0
                ? "text-red-500"
                : "text-green-500"
            }
          >
            {product.size_stock[selectedSize] === 1
              ? "One left in stock"
              : Math.max(0, sizeStock[selectedSize] - quantity)}{" "}
            {product.size_stock[selectedSize] === 1 ? "left" : "available"}
          </span> */}
          <p className="px-3 text-gray-200 mt-2">
            Stock:{" "}
            <span
              className={
                product.sizes[selectedSize] === 0
                  ? "text-red-600"
                  : "text-green-300"
              }
            >
              {product.sizes[selectedSize]}{" "}
              {product.sizes[selectedSize] === 1 ? "left" : "available"}
            </span>
          </p>
        </div>
        <div className="flex items-center justify-center mt-2">
          <button
            onClick={handleAddToCart}
            disabled={product.sizes[selectedSize] === 0 || loading}
            className={`mt-4 px-4 py-2 text-white rounded-md ${
              product.sizes[selectedSize] === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading
              ? "Adding..."
              : product.sizes[selectedSize] === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
