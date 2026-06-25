import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <button
      type="button"
      onClick={() => setIsDarkMode((current) => !current)}
      aria-pressed={isDarkMode}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative flex h-8 w-16 items-center rounded-full border-2 p-1 transition-all duration-300 ${
        isDarkMode
          ? "bg-slate-700 border-slate-500"
          : "bg-slate-200 border-slate-400"
      }`}
    >
      <span
        className={`absolute flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${
          isDarkMode ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {isDarkMode ? (
          <LuMoon className="text-slate-800" size={16} />
        ) : (
          <LuSun className="text-amber-500" size={16} />
        )}
      </span>
    </button>
  );
};

export default DarkModeToggle;
