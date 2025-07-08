import { useState, useEffect } from "react";

const languages = [
  { label: "English", code: "en" },
  { label: "हिन्दी",  code: "hi" },
];

export default function LanguageSelector() {
  // 1️⃣ Read saved language or default to English
  const [langCode, setLangCode] = useState<string>(() => {
    return localStorage.getItem("ui-language") || "en";
  });

  // 2️⃣ Whenever it changes, persist + set <html lang=...>
  useEffect(() => {
    localStorage.setItem("ui-language", langCode);
    document.documentElement.setAttribute("lang", langCode);
  }, [langCode]);

  return (
    <div>
      <label className="block sm:text-sm text-xs mb-1">UI Language</label>
      <select
        className="w-full themeInp p-2 rounded cursor-pointer"
        value={langCode}
        onChange={(e) => setLangCode(e.target.value)}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
