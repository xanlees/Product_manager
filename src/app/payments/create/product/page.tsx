"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Products } from "../value"
import { ProductSchema } from "../schema"

export default function ProductForm() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Products>({
        resolver: zodResolver(ProductSchema),
    });


    const [file, setFile] = useState(null)
    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    return (
        <div className=" max-h-screen flex justify-center items-center">
            <Card className="w-[450px]">
                <CardHeader>
                    <CardTitle>Create New Product</CardTitle>
                    {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-64 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadIcon className="w-10 h-10 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                            {file && (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Name of your project" />
                                <Label htmlFor="description">Decription</Label>
                                <Textarea id="description" placeholder="Decription" />
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" type="number" placeholder="Price" />
                            </div>
                            <div className="flex flex-col space-y-1.5">

                            </div>
                        </div>
                    </form>
                </CardContent>
                {/* <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Deploy</Button>
                </CardFooter> */}
            </Card>

        </div>

    )
}


function UploadIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    )
}