"use client";

import { BsSun, BsMoon } from "react-icons/bs";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  console.log(`ThemeToggle`, theme);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
      {theme === "light" ? <BsMoon className="text-black" /> : <BsSun className="text-yellow-400" />}
    </button>
  );
}
