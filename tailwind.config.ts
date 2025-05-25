// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}", // adjust as needed
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        input: "var(--input)",

        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        "primary-light": "var(--primary-light)",
        "primary-foreground": "var(--primary-foreground)",

        secondary: "var(--secondary)",
        "secondary-light": "var(--secondary-light)",
        "secondary-foreground": "var(--secondary-foreground)",

        success: "var(--success)",
        "success-light": "var(--success-light)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",

        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",

        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",

        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",

        ring: "var(--ring)",
      },
    },
  },
  darkMode: "class", // Only if you're using `.dark` class to toggle dark mode
};
export default config;
