"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="w-7 h-7 flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
      >
        <span className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-7 h-7 flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150 rounded cursor-pointer"
    >
      {resolvedTheme === "dark" ? (
        <Sun size={15} strokeWidth={1.5} />
      ) : (
        <Moon size={15} strokeWidth={1.5} />
      )}
    </button>
  );
}
