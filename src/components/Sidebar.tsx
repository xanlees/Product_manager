import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4 fixed left-0 top-0">
      <h2 className="text-lg font-bold mb-4">Dashboard</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/" className="hover:text-gray-400">
              Home
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/profile" className="hover:text-gray-400">
              User
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/contact" className="hover:text-gray-400">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
