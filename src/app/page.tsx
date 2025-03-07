import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-blue-600"> Work Management</h1>
      <p className="text-lg text-gray-600 mt-2">
          Welcome to the Work Management system!
      </p>
      <ToastContainer />
    </div>
  );
}
