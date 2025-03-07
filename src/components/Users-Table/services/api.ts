

import axios from "axios";
import { Users } from "../data/users";

const API_URL = "http://localhost:8000/api/v1/user?is_staff=False"


export const fetchUser = async (): Promise<Users[]> => {
  const response = await axios.get(API_URL);
  return response.data.results;
};


export const CreateUser = async (customer: Omit<Users, "id">) => {
    const response = await axios.post('http://localhost:8000/api/v1/user/register', customer);
    return response.data;
  };

export const updateUser = async (id: number, customer: Omit<Users, "id">) => {
    const response = await axios.put(`${'http://localhost:8000/api/v1/user?is_staff=False'}/${id}`, customer);
    return response.data;
  };

export const deleteUser = async (id: number) => {
    await axios.delete(`${'http://localhost:8000/api/v1/user'}/${id}`);
  };