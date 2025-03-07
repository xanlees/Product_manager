"use client";
import { useForm } from "react-hook-form";
import { Users } from "../../data/users";
import { updateUser } from "../../services/api";
import { useRouter } from "next/navigation";

export default function EditForm({ user }: { user: Users }) {
    const { register, handleSubmit, formState: { errors } } = useForm<Users>({
        defaultValues: user, 
      });

  const router = useRouter();
  


  const onSubmit = async (data: Users) => {
    try {
      await updateUser(data.id, data); // Assuming updateUser(id, data)
      router.push("/user"); // Redirect after successful update
    } catch (error) {
      console.error("Update failed", error);
    }
  };

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
      </button>
    </form>
  );
}
