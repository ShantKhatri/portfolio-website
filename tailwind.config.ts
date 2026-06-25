import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        fg: "var(--fg)",
        "fg-muted": "var(--fg-muted)",
        "fg-subtle": "var(--fg-subtle)",
        bg: "var(--bg)",
        "bg-surface": "var(--bg-surface)",
        border: "var(--border)",
        "border-mid": "var(--border-mid)",
        green: "var(--green)",
        "green-bg": "var(--green-bg)",
        amber: "var(--amber)",
        "amber-bg": "var(--amber-bg)",
        blue: "var(--blue)",
        "blue-bg": "var(--blue-bg)",
        purple: "var(--purple)",
        "purple-bg": "var(--purple-bg)",
        red: "var(--red)",
      },
      maxWidth: {
        content: "720px",
      },
      borderRadius: {
        pill: "999px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
};

export default config;
