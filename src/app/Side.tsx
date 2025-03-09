import Link from "next/link"
import { FaUsers } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { RiProductHuntLine } from "react-icons/ri";


export const Sidebar = () =>{
    return (
        <aside className="w-64 h-screen bg-gray-800 text-white p-4 fixed left-0 top-0">
          <h2 className="text-lg font-bold flex items-center p-2 hover:bg-gray-700 rounded">
            <RiProductHuntLine className="mr-2 w-20 h-14" />
            Product Management
          </h2>
          <nav>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="flex items-center p-2 hover:bg-gray-700 rounded"
                >
                  <FaHome className="mr-2" />
                  Home
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/user"
                  className=" flex items-center p-2 hover:bg-gray-700 rounded"
                >
                  <FaUsers className="mr-2" />
                  Users
                </Link>
              </li> */}
              {/* <li>
                <Link
                  href="/agent"
                  className=" flex items-center p-2 hover:bg-gray-700 rounded"
                >
                  <MdSupportAgent className="mr-2"  />
                  Agents
                </Link>
              </li> */}
              <Link
                href="/product"
                className=" flex items-center p-2 hover:bg-gray-700 rounded"
              >
                <AiFillProduct className="mr-2" />
                Products
              </Link>
            </ul>
          </nav>
        </aside>
    )
}