

import axios from "axios";
import { Products } from "../data/product";

const API_URL = "http://localhost:8000/api/v1/products"


export const fetchProduct = async (): Promise<Products[]> => {
  const response = await axios.get(API_URL);
  return response.data.results;
};


export const creatProduct = async (formData: FormData) => {
 
  return fetch(`http://localhost:8000/api/v1/products`, {
    method: "POST",
    body: formData,
  });
};

export const updateProduct = async (formData: FormData, id: number) => {
  if (!id) {
    console.log("Product ID is undefined");
    return;
  }

  return fetch(`http://localhost:8000/api/v1/products/${id}`, {
    method: "PUT",
    body: formData,
  });
};

export const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/products/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }
  
      return response;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
    
  };