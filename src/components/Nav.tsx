"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/work", label: "work" },
  { href: "/writing", label: "writing" },
  { href: "/community", label: "community" },
  { href: "/about", label: "about" },
  { href: "/patents", label: "patents" },
];

export function Nav() {
  const pathname = usePathname();
  const scrollDir = useScrollDirection();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHidden = scrollDir === "down";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 bg-[var(--bg)]/80 backdrop-blur-sm border-b border-[var(--border)]",
          "transition-transform duration-300 ease-out",
          isHidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <nav
          aria-label="main navigation"
          className="max-w-[720px] mx-auto px-5 flex items-center justify-between h-12"
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-mono text-[15px] font-medium text-[var(--fg)] hover:text-[var(--fg-muted)] transition-colors duration-150"
          >
            prashant khatri
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-5">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-[18px] transition-colors duration-150",
                    isActive
                      ? "text-[var(--fg)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/contact"
              className="hidden md:inline-flex text-[15px] font-mono px-3 py-1.5 border border-[var(--border-mid)] rounded-full text-[var(--fg)] hover:bg-[var(--bg-surface)] transition-colors duration-150"
            >
              get in touch
            </Link>
            {/* Mobile: get in touch + hamburger */}
            <Link
              href="/contact"
              className="md:hidden text-[15px] font-mono px-3 py-1.5 border border-[var(--border-mid)] rounded-full text-[var(--fg)] hover:bg-[var(--bg-surface)] transition-colors duration-150"
            >
              get in touch
            </Link>
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors cursor-pointer"
              aria-label="Open navigation menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
