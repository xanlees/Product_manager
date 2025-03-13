import axios from "axios";
import { Products, columns } from "./columns"
import { DataTable } from "./data-table"

export const fetchProduct = async (): Promise<Products[]> => {
    const response = await axios.get('http://localhost:8000/api/v1/products');
    return response.data.results;
};


export default async function DemoPage() {
    const data = await fetchProduct()

    return (
        <main className="flex min-h-screen flex-col items-center px-4 md:px-8 lg:px-16 py-28">
            <div className="w-full">
                <h1 className="mb-6 text-3xl font-semibold">Products</h1>
                <div className="w-full overflow-auto rounded-lg border shadow-sm">
                    <DataTable columns={columns} data={data} />
                </div>
            </div>
        </main>
    )
}
