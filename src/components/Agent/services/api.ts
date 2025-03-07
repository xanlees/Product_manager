

import axios from "axios";
import { Agents } from "../data/agent";

const API_URL = "http://localhost:8000/api/v1/user?is_staff=True"


export const fetchAgent = async (): Promise<Agents[]> => {
  const response = await axios.get(API_URL);
  return response.data.results;
};


export const Create_Agent = async (customer: Omit<Agents, "id">) => {
    const response = await axios.post('http://localhost:8000/api/v1/user/register_agent', customer);
    return response.data;
  };

export const updateUser = async (id: number, customer: Omit<Agents, "id">) => {
    const response = await axios.put(`${API_URL}/${id}`, customer);
    return response.data;
  };

export const deleteUser = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
  };