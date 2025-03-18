"use client"

import * as React from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ProductForm from "./product/page"
import StockForm from "./stock/page"
import CreateProduct from "./variant/page"

export default function FormPage() {

    return (
        <div className=" max-h-screen flex justify-center items-center py-60">
            <Card className="w-[650px]">
                <CardHeader>
                    <CardTitle>Create New Product</CardTitle>
                    {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
                </CardHeader>
                <CardContent>
                    <div className="grid items-center ">
                        <div className="">
                            {/* <ProductForm /> */}
                            <CreateProduct />
                        </div>
                        <div className=" -mt-6 px-20 flex text-left ">
                            {/* <StockForm /> */}
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>

    )
}
