// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useForm } from "react-hook-form";
// import { updateProduct } from "@/components/product/services/api"; // ✅ API function
// import { DialogFooter } from "@/components/ui/dialog";


// interface Product {
//     id: number;
//     name: string;
//     description: string;
//     price: number;
// }

// interface ProductActionsProps {
//     product: Product;
//     deleteProduct: (id: number) => void;
//     onClose: () => void;
//     onUpdate: (updatedProduct: Product) => void;
// }

// const EditProductForm = ({ product, onClose, onUpdate }: ProductActionsProps) => {
//     const { register, handleSubmit, setValue } = useForm({
//         defaultValues: {
//             name: product.name,
//             description: product.description,
//             price: product.price,
//         }
//     });

//     const [loading, setLoading] = useState(false);

//     const onSubmit = async (data) => {
//         setLoading(true);
//         try {
//             const updatedProduct = await updateProduct(data, product.id);
//             onUpdate(updatedProduct); // ✅ Instantly update table
//             onClose(); // ✅ Close modal
//         } catch (error) {
//             console.error("Error updating product:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="name" className="text-right">Name</Label>
//                 <Input id="name" {...register("name")} className="col-span-3" />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="description" className="text-right">Description</Label>
//                 <Input id="description" {...register("description")} className="col-span-3" />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="price" className="text-right">Price</Label>
//                 <Input id="price" type="number" {...register("price")} className="col-span-3" />
//             </div>

//             <DialogFooter className="mt-4">
//                 <Button type="submit" disabled={loading}>
//                     {loading ? "Editing..." : "Edit Product"}
//                 </Button>
//             </DialogFooter>
//         </form>
//     );
// };

// export default EditProductForm;
