"use client";

import { useEffect, useState } from "react";

type ScrollDirection = "up" | "down" | "top";

export function useScrollDirection(): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>("top");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const update = () => {
      const scrollY = window.scrollY;
      if (scrollY < 10) {
        setDirection("top");
      } else if (scrollY > lastScrollY) {
        setDirection("down");
      } else if (scrollY < lastScrollY) {
        setDirection("up");
      }
      lastScrollY = scrollY;
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return direction;
}
