
import CartPage from '../../components/product/carts'

const List = () => {
    return (
        <div className="flex min-h-screen flex-col items-center px-4 md:px-8 lg:px-16 py-28">
            <div className="w-full space-y-2">
                <h1 className="mb-6 text-3xl font-semibold">Carts</h1>
                <div className="w-full overflow-auto rounded-lg border shadow-sm">
                    <CartPage />
                </div>
            </div>
        </div>
    );
}

export default List;
