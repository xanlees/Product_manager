"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation"; // ✅ Get product ID from URL
import Image from "next/image";
import { ColorImage, Products } from "../data/product";
import { useCart } from "../carts/cartContext";
import { fetchProduct } from "../services/api";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ProductDetail() {
  const { id } = useParams(); // ✅ Get product ID from URL
  const [product, setProducts] = useState<Products | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  // const [selectedImage, setSelectedImage] = useState<string>("");
  const [zoomed, setZoomed] = useState(false);

  // const availableSizes = ["S", "M", "L", "XL"];
  // const [selectedSize, setSelectedSize] = useState(availableSizes[0]);

  // const [sizeStock, setSizeStock] = useState<{ [key: string]: number }>({});
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  // const [selectedSize, setSelectedSize] = useState("40");
  // const [selectedColor, setSelectedColor] = useState<ColorImage | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorImage | null>(null); // ✅ Track selected color
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [filteredImages, setFilteredImages] = useState<string[]>([]);
  // const [image, setImages] = useState<string[]>([]); // ✅ Declare images state

  // const [currentIndex, setCurrentIndex] = useState(0);

  // console.log("ttttttttttt", setImages);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // const thumbnailsToShow = 3;

  const colorMatches: Record<string, string[]> = {
    White: ["white", "airwhite"],
    Black: ["black", "airblack"],
    Blue: ["blue", "airsky"],
    Red: ["red", "airred"], // ✅ Added new Red color
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProduct();
        const selectedProduct = data.find((p: Products) => p.id === Number(id));

        if (selectedProduct) {
          setProducts(selectedProduct);

          const defaultColor: ColorImage | null =
            selectedProduct.color_images?.[0] || null;
          setSelectedColor(defaultColor);
          setSelectedImage(defaultColor?.image || selectedProduct.image);
          // setSelectedImage(
          //   selectedProduct.image.startsWith("http")
          //     ? selectedProduct.image
          //     : `http://localhost:8000${selectedProduct.image}`
          // );
          // setSelectedImage(selectedProduct.image);
          // if (selectedProduct.stock_sizes.length > 0) {
          //   setSelectedSize(selectedProduct.stock_sizes[0].size); // ✅ Default to first available size
          // }
          if (selectedProduct.stock_sizes.length > 0) {
            setSelectedSize(selectedProduct.stock_sizes[0].size);
          }

          // if (selectedProduct.color_images.length > 0) {
          //   setSelectedImage(selectedProduct.color_images[0].image);
          // }
          // setAdditionalImages(
          //   selectedProduct.additional_images.filter((img) =>
          //     img.includes(defaultColor?.color_name.toLowerCase())
          //   ) || []
          // );
          updateAdditionalImages(
            selectedProduct.additional_images,
            defaultColor
          );
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [id]);

  useEffect(() => {
    if (!product || !selectedColor) return;

    const matchingPatterns = colorMatches[selectedColor.color_name] || [];

    const filtered = product.additional_images.filter((img) =>
      matchingPatterns.some((pattern) => img.includes(pattern))
    );

    setFilteredImages(filtered.length > 0 ? filtered : [selectedColor.image]);
  }, [selectedColor, product]);

  const updateAdditionalImages = (
    allImages: string[],
    color: ColorImage | null
  ) => {
    if (!color) return;
    const matchingNames = colorMatches[color.color_name] || [
      color.color_name.toLowerCase(),
    ];

    const filtered = allImages.filter((img) =>
      matchingNames.some((name) => img.toLowerCase().includes(name))
    );

    setFilteredImages(filtered.length > 0 ? filtered : [color.image]);
  };

  const selectedStock = product?.stock_sizes.find(
    (stock) => stock.size === selectedSize
  );

  if (loading || !product) {
    return <p className="text-center text-gray-500">Loading product...</p>;
  }

  // const images = [
  //   product.image.startsWith("http")
  //     ? product.image
  //     : `http://localhost:8000${product.image}`,
  //   ...(Array.isArray(product.additional_images)
  //     ? product.additional_images.map((img) =>
  //         img.startsWith("http") ? img : `http://localhost:8000${img}`
  //       )
  //     : []),
  // ].filter(Boolean);

  const handleColorChange = (color: ColorImage) => {
    setSelectedColor(color);
    setSelectedImage(color.image); // ✅ Set new main image
    // setAdditionalImages(
    //   product.additional_images.filter((img) =>
    //     img.includes(color.color_name.toLowerCase())
    //   ) || []
    // );
    if (product) {
      updateAdditionalImages(product.additional_images, color);
    }
  };

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

  // const handleColorChange = (colors: string) => {
  //   setSelectedColor(colors);
  //   setSelectedImage(product.color_images[colors]); // ✅ Update image based on color
  // };

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

  // const handleAddToCart = async () => {
  //   if (quantity < 1 || quantity > sizeStock[selectedSize]) {
  //     alert("Invalid quantity!");
  //     return;
  //   }
  const handleAddToCart = async () => {
    if (quantity < 1 || !selectedStock || quantity > selectedStock.stock) {
      alert("Invalid quantity!");
      return;
    }

    setLoading(true);

    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      color: typeof selectedColor === "string" ? selectedColor : selectedColor?.color_name || "", // ✅ Ensure it's always a string
      size: selectedSize || "",
      image: selectedImage,
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
      const textResponse = await response.text(); // Read raw response
      console.log("Raw API Response:", textResponse);

      let jsonResponse;
      try {
        jsonResponse = JSON.parse(textResponse);
        console.log("Parsed JSON:", jsonResponse);
      } catch (error) {
        console.error("❌ Error parsing JSON:", error, "\nRaw Response:", textResponse);
        return;
      }

      if (!response.ok) {
        console.error("API Error:", jsonResponse.error || "Unknown error");
        return;
      }

      console.log("Stock updated:", jsonResponse);

      alert("Product added to cart successfully!");

      setProducts((prevProduct) =>
        prevProduct
          ? {
              ...prevProduct,
              stock_sizes: prevProduct.stock_sizes.map((s) =>
                s.size === selectedSize
                  ? { ...s, stock: s.stock - quantity }
                  : s
              ),
            }
          : prevProduct
      );

      // setSizeStock((prevStock) => ({
      //   ...prevStock,
      //   [selectedSize]: Math.max(0, prevStock[selectedSize] - quantity), // ✅ Reduce only selected size stock
      // }));
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen items-center justify-center bg-white text-gray-700 p-6 rounded-lg shadow-lg max-w-full w-full dark:bg-slate-900">
      {/* ✅ Image Preview */}
      <div className="relative flex flex-col justify-start items-start">
        <div className=" flex px-28 justify-center space-x-2 relative  ">
          {/* <button
            onClick={goToPrev}
            className="absolute left-0 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button> */}
          {/* <div>
              {images.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  width={50}
                  height={40}
                  className="cursor-pointer rounded border hover:border-blue-500"
                  onMouseEnter={() => setHoveredImage(img)}
                  onMouseLeave={() => setHoveredImage(null)}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div> */}

          <div ref={scrollContainerRef} className="space-y-2">
            {filteredImages.length > 0 ? (
              filteredImages.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  width={50}
                  height={40}
                  className={`cursor-pointer rounded border ${
                    selectedImage === img
                      ? "border-blue-500"
                      : "hover:border-blue-500"
                  }`}
                  onMouseEnter={() => setSelectedImage(img)}
                />
              ))
            ) : (
              <p className="text-gray-500">No additional images available</p>
            )}
          </div>

          <div className=" overflow-hidden cursor-zoom-in ">
            <Image
              src={selectedImage}
              alt="Selected Product"
              width={860}
              height={830}
              className="transition-transform duration-300 ease-in-out w-full max-w-[600px] min-h-96 mx-auto"
              onClick={() => setZoomed(true)}
            />
          </div>

          <div className=" -mt-2 px-12 space-y-6 dark:text-gray-100">
            <p className="text-2xl font-bold ">{product.name}</p>
            <p className="text-gray-600 mt-2 dark:text-gray-100">
              {product.price} $
            </p>
            <p className="text-gray-600 mt-4 dark:text-gray-400">Color:</p>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {product.color_images.length > 0 ? (
                product.color_images.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color)}
                    className={`w-16 h-16 rounded-md border-2 ${
                      selectedColor?.color_name === color.color_name
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <Image
                      src={color.image}
                      alt={color.color_name}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full rounded"
                    />
                  </button>
                ))
              ) : (
                <p className="text-red-500">No colors available</p>
              )}
            </div>
            <p className="text-gray-600 mt-4 dark:text-gray-400">Size:</p>
            <div className="mt-2 flex gap-2">
              {product.stock_sizes.length > 0 ? (
                product.stock_sizes.map((stock) => (
                  <button
                    key={stock.id}
                    onClick={() => setSelectedSize(stock.size)}
                    className={`px-4 py-2 border rounded-md cursor-pointer ${
                      selectedSize === stock.size
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-blue-400 hover:text-white`}
                  >
                    {stock.size}
                  </button>
                ))
              ) : (
                <p className="text-red-500">No sizes available</p>
              )}
            </div>

            <div className="flex items-center justify-center mt-2">
              {/* <label className="mr-2 text-gray-600">Qty:</label>

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
                    setQuantity((prev) =>
                      Math.min(selectedStock?.stock || 0, prev + 1)
                    )
                  }
                  disabled={!selectedStock || selectedStock.stock <= 0}
                  className={`px-2 w-8 border bg-slate-100 ${
                    !selectedStock || selectedStock.stock <= 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-300"
                  }`}
                >
                  +
                </button>

                <p className="px-3 text-gray-200 mt-2">
                  Stock:{" "}
                  <span
                    className={
                      selectedStock?.stock === 0
                        ? "text-red-600"
                        : "text-green-300"
                    }
                  >
                    {selectedStock?.stock || 0}{" "}
                    {selectedStock?.stock === 1 ? "left" : "available"}
                  </span>
                </p> */}
            </div>
            <div className=" mt-28 flex ">
              <button
                onClick={handleAddToCart}
                disabled={
                  !selectedStock || selectedStock.stock === 0 || loading
                }
                className={`px-4 py-2 text-white rounded-3xl ${
                  !selectedStock || selectedStock.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {loading
                  ? "Adding..."
                  : !selectedStock || selectedStock.stock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>
            </div>
          </div>

          {/* <button
            onClick={goToNext}
            className="absolute right-0 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          >
            <FaChevronRight className="w-5 h-5" />
          </button> */}
        </div>
      </div>
      <div className=" grid grid-cols-1 divide-x-6 ">
        {/* <button
            onClick={scrollLeft}
            // disabled={startIndex === 0}
            className=" h-10 w-8 p-2 text-white rounded disabled:opacity-50"
          >
            <FaChevronLeft className="w-5 h-5 text-gray-600 hover:text-sky-700" />
          </button>
          <div
            ref={scrollContainerRef}
            className=" flex gap-2 overflow-x-scroll no-scrollbar scroll-smooth w-64 mx-auto"
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
          <Image
            src={product.image}
            alt="Main Image"
            width={80}
            height={60}
            className="cursor-pointer rounded border hover:border-blue-500"
            onClick={() => setSelectedImage(product.image)}
          />
          
          <button
            onClick={scrollRight}
            // disabled={startIndex + thumbnailsToShow >= images.length}
            className=" h-10 w-8 p-2 rounded text-white disabled:opacity-50 z-10"
          >
            <FaChevronRight className="w-5 h-5 text-gray-700 hover:text-sky-700" />
          </button> */}
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

      <div className="mt-3 flex gap-2 justify-start items-start"></div>

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
      {/* <p className="text-gray-600 mt-4">Color:</p>
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
        </div> */}

      {/* <p className="text-gray-600">Size:</p>
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
        </div> */}
    </div>
  );
}
