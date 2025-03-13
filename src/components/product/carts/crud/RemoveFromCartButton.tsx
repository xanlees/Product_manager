"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useCart } from "../../../contexts/cartContext";
import { RiDeleteBin5Line } from "react-icons/ri";

interface Props {
    id: number;
    size: string;
}

export default function RemoveFromCartButton({ id, size }: Props) {
    const { removeFromCart } = useCart();
    const [open, setOpen] = useState(false);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <a className=" "><RiDeleteBin5Line className=" w-10 h-4 text-red-700 cursor-pointer"/></a>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle className=" text-orange-500">Confirm Removal</AlertDialogTitle>
                <AlertDialogDescription className=" text-red-500">
                    Are you sure you want to remove this item from your cart? This action cannot be undone.
                </AlertDialogDescription>
                    </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            removeFromCart(id, size);
                            setOpen(false);
                        }}
                    >
                        Remove
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
