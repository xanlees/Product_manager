"use client";
import { useForm } from "react-hook-form";
import { Users } from "../../data/users";
import { useState } from "react";
import { CreateUser } from "../../services/api";

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<Users>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: Users) => {
    setLoading(true);
    try {
      const respone = await CreateUser(data);
      console.log("User created successfully:", respone);
      alert("User created successfully");
    } catch (error){
      alert(" failed to create user")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded">
      <input
        {...register("username", { required: "Name is required" })}
        placeholder="Name"
        className="border p-2 w-full text-black"
      />
      {errors.username && <p className="text-red-500">{errors.username.message}</p>}

      <input
        {...register("password", { required: "Email is required" })}
        placeholder="Password"
        type="password"
        className="border p-2 w-full text-black"
      />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register("is_active")}
          className="w-4 h-4"
        />
        <span>Active</span>
      </label>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
      {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
