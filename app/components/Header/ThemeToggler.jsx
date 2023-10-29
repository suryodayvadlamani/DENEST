"use client";

import { useTheme } from "next-themes";
import { buttonVariants } from "@UI/button";
import { LuMoon, LuSun } from "react-icons/lu";

import { cn } from "@lib/utils";
function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "w-9 px-0 cursor-pointer"
      )}
    >
      <LuSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <LuMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle Theme</span>
    </div>
  );
}

export default ThemeToggler;
