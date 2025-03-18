import { useState } from "react";
import { Eye, MoreHorizontal, Pencil, Terminal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuView, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Products, useProductStore } from "@/components/product/data/product";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { updateProduct } from "@/components/product/services/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
}

interface ProductActionsProps {
    product: Product;
    deleteProduct: (id: number) => void;
    onClose: () => void;
}

export default function ProductActions({ product, deleteProduct }: ProductActionsProps) {
    const [open, setOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false); // ✅ Track Dialog Open State 
    const router = useRouter();
    const setProduct = useProductStore((state) => state.setProduct);

    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<Products>({
        defaultValues: {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
        },
    });

    const [showAlert, setShowAlert] = useState(false);


    const onSubmit = async (data: Products) => {
        setLoading(true);

        console.log("Form data before submitting:", data);

        if (!data.id) {
            alert("Product ID is missing!");
            setLoading(false);
            return;
        }

        const formData = new FormData();

        formData.append(
          "translations",
          JSON.stringify({ en: { name: data.name } })
        );
        formData.append("description", String(data.description));
        formData.append("price", String(data.price));

        try {
            const updatedProduct = await updateProduct(formData, data.id);
            console.log("Product updated successfully:", updatedProduct);
            setOpen(false);
            window.location.reload()
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000)
        } catch (err) {
            console.log("Error updating", err);

        } finally {
            setLoading(false);
        }
        setEditDialogOpen(false)

    }

    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuView align="end">
                {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Pencil className="cursor-pointer text-pink-500" />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Product</DialogTitle>
                                <DialogDescription>
                                    Update product details and save.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <form onSubmit={handleSubmit(onSubmit)} className=" grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="">Name</Label>
                                        <Input id="name" {...register("name", { required: "Name is required" })} className="col-span-3" />
                                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="description" className="">Description</Label>
                                        <Input id="description" {...register("description")} className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="price" className="">Price</Label>
                                        <Input id="price" type="number" {...register("price", { valueAsNumber: true })} className="col-span-3" />
                                    </div>
                                    <DialogFooter className=" mt-4 ">
                                        <Button type="submit" disabled={loading}  >
                                             {loading ? "Editting..." : "Edit Product"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </div>
                            
                        </DialogContent>
                    </Dialog>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <span onClick={() => { setProduct(product); router.push(`/product/show`); }}>
                        <Eye className="cursor-pointer text-cyan-500" />
                    </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {/* ✅ Delete Confirmation AlertDialog */}
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger asChild>
                                <p className=" cursor-pointer "><Trash className="text-red-500"/></p>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-orange-500">
                                    Confirm Deletion
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-red-500">
                                    Are you sure you want to delete this product? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        deleteProduct(product.id);
                                        setOpen(false);
                                    }}
                                >
                                    <span>Delete</span>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuItem>
            </DropdownMenuView>
        </DropdownMenu>
            {showAlert && (
                <div className="fixed top-24 right-10 w-full max-w-sm z-50">
                    <Alert className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded relative">
                        <Terminal className="h-4 w-4 text-green-500" />
                        <AlertTitle className="text-green-700">Update Success!</AlertTitle>
                        <AlertDescription>Product updated successfully.</AlertDescription>
                    </Alert>
                </div>
            )}
       </>
    );
};

