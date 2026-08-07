"use client";

import { MotionConfig } from "motion/react";

/**
 * `reducedMotion="user"` makes every motion component skip transform and layout
 * animation when the OS asks for reduced motion — the CSS media query in
 * globals.css only covers CSS-driven animation, not JS-driven ones.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
