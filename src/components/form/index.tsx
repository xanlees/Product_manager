// "use client";
// import { useForm } from "react-hook-form";


// export default function ContactForm() {
//   const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

//   const onSubmit = (data: FormData) => {
//     console.log("Form Data:", data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded">
//       <input
//         {...register("name", { required: "Name is required" })}
//         placeholder="Name"
//         className="border p-2 w-full"
//       />
//       {errors.name && <p className="text-red-500">{errors.name.message}</p>}

//       <input
//         {...register("email", { required: "Email is required" })}
//         placeholder="Email"
//         className="border p-2 w-full"
//       />
//       {errors.email && <p className="text-red-500">{errors.email.message}</p>}

//       <button type="submit" className="bg-blue-500 text-white p-2 rounded">
//         Submit
//       </button>
//     </form>
//   );
// }
