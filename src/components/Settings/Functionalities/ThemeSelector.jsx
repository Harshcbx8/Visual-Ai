import { useEffect, useState } from "react";

export default function ThemeSelector() {
  const [theme, setTheme] = useState(() => {
    // Read from localStorage initially
    return localStorage.getItem("theme") || "dark";
  });

  // Set data-theme attribute and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const options = ["dark", "light", "glass"];

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
