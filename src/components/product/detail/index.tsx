"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation"; // ✅ Get product ID from URL
import Image from "next/image";
import { ColorImage, Products } from "../data/product";
import { useCart } from "../../contexts/cartContext";
import { fetchProduct } from "../services/api";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function ProductDetail() {
  const { id } = useParams(); // ✅ Get product ID from URL
  const [product, setProducts] = useState<Products | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const [zoomed, setZoomed] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorImage | null>(null); // ✅ Track selected color
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [filteredImages, setFilteredImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);


  const [showAlert, setShowAlert] = useState(false);



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

          updateAdditionalImages(selectedProduct.additional_images, defaultColor);

          if (defaultColor && defaultColor.stock_sizes.length > 0) {
            setSelectedSize(defaultColor.stock_sizes[0].size);
          }  
          updateAdditionalImages(selectedProduct.additional_images, defaultColor);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [id]);

  const updateAdditionalImages = (allImages: string[], color: ColorImage | null) => {
    if (!color) {
      setFilteredImages([]);
      return;
    }

    const colorNameLower = color.color_name.toLowerCase();

    const filtered = allImages.filter((img) =>
      img.toLowerCase().includes(colorNameLower)
    );

    setFilteredImages(filtered);
  };

  // ✅ Handle Color Change
  const handleColorChange = (color: ColorImage) => {
    setSelectedColor(color);
    setSelectedImage(color.image);

    if (product?.additional_images) {
      updateAdditionalImages(product.additional_images, color);
    }
  };


  const selectedStock = selectedColor?.stock_sizes.find(
    (stock) => stock.size === selectedSize
  );

  if (loading || !product) {
    return <p className="text-center text-gray-500">Loading product...</p>;
  }

  const images = product?.additional_images || [];

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const goToPrev = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  // const scrollLeft = () => {
  //   if (scrollContainerRef.current) {
  //     scrollContainerRef.current.scrollLeft -= 120; // Adjust based on thumbnail width
  //   }
  // };

  // const scrollRight = () => {
  //   if (scrollContainerRef.current) {
  //     scrollContainerRef.current.scrollLeft += 120; // Adjust based on thumbnail width
  //   }
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


  const handleAddToCart = async () => {
    if (quantity < 1 || !selectedStock || quantity > selectedStock.stock) {
      alert("❌ This item is out of stock!");
      return;
    }

    setLoading(true);

    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      color: selectedColor?.color_name || "",
      size: selectedSize || "",
      image: selectedImage,
    };

    addToCart(newItem);

    try {
      // ✅ Reduce stock in backend
      const formData = new FormData();
      formData.append("color_name", selectedColor?.color_name || "");
      formData.append("size", selectedSize || "");
      formData.append("quantity", String(quantity));



      const response = await fetch(
        `http://localhost:8000/api/v1/products/${product.id}/reduce_stock/`,
        {
          method: "PATCH",
          body: formData,
        }
      );


      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        alert("Server Error: Check console for details.");
        return;
      }

      try {
        const jsonResponse = await response.json();
        console.log("Success:", jsonResponse);
        setShowAlert(true);
        setTimeout(() => {
        setShowAlert(false);
        }, 3000);
      } catch (jsonError) {
        console.log("JSON Error:", jsonError)
        const rawText = await response.text();
        console.error("Invalid JSON response:", rawText);
        alert("Invalid JSON received, check backend response.");
      }

      setProducts((prevProduct) =>
        prevProduct
          ? {
            ...prevProduct,
            color_images: prevProduct.color_images.map((color) =>
              color.color_name === selectedColor?.color_name
                ? {
                  ...color,
                  stock_sizes: color.stock_sizes.map((s) =>
                    s.size === selectedSize ? { ...s, stock: Math.max(0, s.stock - quantity) } : s
                  ),
                }
                : color
            ),
          }
          : prevProduct
      );

      

      
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen items-center justify-center p-6 rounded-lg shadow-lg max-w-full w-full ">
      {/* ✅ Image Preview */}
      <div className="relative flex flex-col justify-start items-start">
        <div className=" flex px-28 justify-center space-x-2 relative  ">
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
                  className={`cursor-pointer rounded border ${selectedImage === img
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
            <div className="">
              
              <Button
                onClick={goToPrev}
                className=" -mt-14 absolute left-48 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
              >
                <FaChevronLeft className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={goToNext}
                className=" -mt-14 absolute left-64 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
              >
                <FaChevronRight className="w-5 h-5" />
              </Button>

            </div>
            
          </div>

          <div className=" -mt-2 px-12 space-y-6 dark:text-gray-100">
            <p className="text-2xl font-bold ">{product.name}</p>
            <p className=" mt-2 dark:text-gray-100">
              {product.price} $
            </p>
            <p className="0 mt-4 dark:text-gray-400">Color:</p>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {product.color_images.length > 0 ? (
                product.color_images?.map((color) => (
                  <Button
                    key={color.id || color.color_name}
                    onClick={() => handleColorChange(color)}
                    className={`w-20 h-20 rounded border-2 cursor-pointer hover:border-gray-600 ${selectedColor?.id === color.id ? "border-gray-200" : "border-gray-300"
                      }`}
                  >
                    <Image
                      src={color.image}
                      alt={color.color_name}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full rounded"
                    />
                  </Button>
                ))
              ) : (
                <p className="text-red-500">No colors available</p>
              )}
            </div>
            <p className=" mt-4 dark:text-gray-400">Size:</p>
            <div className="mt-2 flex gap-2">
              {selectedColor?.stock_sizes.length > 0 ? (
                selectedColor?.stock_sizes.map((stock) => (
                  <Button
                    key={stock.id || stock.size}
                    onClick={() => setSelectedSize(stock.size)}
                    className={`px-4 py-2 border rounded-md cursor-pointer ${selectedSize === stock.size
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-700"
                      } hover:bg-gray-400 hover:text-white`}
                  >
                    {stock.size}
                  </Button>
                ))
              ) : (
                <p className="text-red-500">No sizes available</p>
              )}
            </div>

            <div className=" flex ">

              <Button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity === 1}
                className={`px-2 w-8 border  ${quantity === 1
                  ? " bg-gray-500 cursor-not-allowed"
                    : "hover:bg-gray-300 "
                  }`}
              >
                -
              </Button>

              <span className="px-4 py-1 dark:bg-slate-900">{quantity}</span>

              <Button
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(selectedStock?.stock || 0, prev + 1)
                  )
                }
                disabled={!selectedStock || selectedStock.stock <= 0}
                className={`px-2 w-8 border ${!selectedStock || selectedStock.stock <= 0
                    ? " cursor-not-allowed"
                    : "hover:bg-gray-700"
                  }`}
              >
                +
              </Button>

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
              </p>
            </div>
   
            <div className=" mt-28 flex ">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedStock || selectedStock.stock === 0 || loading}
                className=' rounded-3xl '
              >
                Add to cart
                  
              </Button>
              {showAlert && (
                <div className="absolute -top-10 -right-32 transform -translate-x-1/2 w-full max-w-sm bg-green-500">
                  <Alert>
                    <Terminal className="h-4 w-4 text-green-500" />
                    <AlertTitle className=" text-green-500">Success!</AlertTitle>
                    <AlertDescription className=" text-green-500">Item added to cart.</AlertDescription>
                  </Alert>
                </div>
              )}

            </div>
          </div>
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
          <button
            onClick={scrollRight}
            // disabled={startIndex + thumbnailsToShow >= images.length}
            className=" h-10 w-8 p-2 rounded text-white disabled:opacity-50 z-10"
          >
            <FaChevronRight className="w-5 h-5 text-gray-700 hover:text-sky-700" />
          </button> */}
      </div>

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
    </div>
  );
}
