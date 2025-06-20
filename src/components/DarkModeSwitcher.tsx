"use client";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";

const DarkModeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <span
      suppressHydrationWarning
      className="cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </span>
  );
};

export default DarkModeSwitcher;
