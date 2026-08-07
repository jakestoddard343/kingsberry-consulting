"use client";

import { motion } from "motion/react";
import Reveal from "./Reveal";
import type { FlyInStyle } from "@/lib/use-fly-in";

/**
 * One markup tree, two entrances. When the section is pinned/scrubbed, pass
 * the widget's `useFlyIn` style and it plays the scroll-driven arrival. When
 * it isn't (mobile, reduced motion — anywhere `scrubbed` is false), omit
 * `style` and this falls back to the ordinary once-on-enter Reveal fade.
 *
 * `scrubbed` doesn't flip mid-render, so which branch a given mount takes
 * doesn't change — no remount thrash between the two.
 */
export default function FlyIn({
  children,
  style,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  style?: FlyInStyle;
  delay?: number;
  className?: string;
}) {
  if (style) {
    return (
      <motion.div style={style} className={className}>
        {children}
      </motion.div>
    );
  }
  return (
    <Reveal delay={delay} className={className}>
      {children}
    </Reveal>
  );
}
