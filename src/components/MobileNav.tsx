"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { href: "/work", label: "work" },
  { href: "/writing", label: "writing" },
  { href: "/community", label: "community" },
  { href: "/about", label: "about" },
  { href: "/patents", label: "patents" },
];

export function MobileNav({ open, onClose }: MobileNavProps) {
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      firstFocusRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <span className="font-mono text-[15px] font-medium tracking-tight">
          prashant khatri
        </span>
        <button
          ref={firstFocusRef}
          onClick={onClose}
          aria-label="Close navigation"
          className="w-8 h-8 flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors cursor-pointer"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 flex flex-col justify-center px-5 gap-0">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="block py-4 text-[18px] font-medium text-[var(--fg)] border-b border-[var(--border)] last:border-0 hover:text-[var(--fg-muted)] transition-colors duration-150"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-6 border-t border-[var(--border)]">
        <Link
          href="/contact"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-[15px] font-mono px-4 py-2 border border-[var(--border-mid)] rounded-full text-[var(--fg)] hover:bg-[var(--bg-surface)] transition-colors duration-150"
        >
          get in touch
        </Link>
      </div>
    </div>
  );
}
