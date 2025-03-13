"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchProduct } from "../services/api";
import { ColorImage, Products } from "../data/product";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CardWithForm() {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProduct();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        products.map((product) => (
          <Card key={product.id} className="w-[350px] hover:shadow-xl hover:scale-105 duration-300 cursor-pointer space-y-3">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/product/${product.id}`}>
                <div className=" ">
                  <div className="relative flex justify-center items-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={140}
                      height={100}
                      className="rounded-md w-52 h-70"
                    />
                  </div>
                  <p className=" mt-4 px-12 ">{product.price} $</p>
                </div>
              </Link>
            </CardContent>
            {/* <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Deploy</Button>
            </CardFooter> */}
          </Card>
        ))
      )}
    </div>
  );
}
