import { useEffect, useState } from "react";

export default function ThemeSelector() {
  const [theme, setTheme] = useState(null); // initially null to prevent immediate overriding

  // Load saved theme AFTER component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Update theme when user selects
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const options = ["dark", "light", "glass"];

  if (!theme) return null; // Optional: render nothing until theme is loaded to avoid flicker

  return (
    <div className="sm:text-sm text-xs space-y-2 w-full">
      <label className="block">Theme</label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="p-2 rounded themeInp cursor-pointer theme-text w-full"
      >
        {options.map((opt) => (
          <option value={opt} key={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
