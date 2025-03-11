import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductAllReview from "@/components/product/show_all_product";

export default function Page() {
  return (
    <div className=" flex justify-start items-start w-screen min-h-screen pt-32 ">
      <div className="w-full p-4">
        <div className="">
          <ProductAllReview />
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
