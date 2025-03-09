
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductAllReview from "@/components/product/show_all_product";


export default function Page() {
  return (
    <div className="w-full flex flex-col items-center bg-gray-100">
      <ProductAllReview/>
      <ToastContainer />
    </div>
  );
}
