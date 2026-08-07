"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const variants: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: easeOut },
  },
};

/** Fade-and-lift a block once, the first time it enters the viewport. */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });
  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref as React.RefObject<never>}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Splits a line into words and staggers them in. Used for section headlines. */
export function RevealWords({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        // The clip box is padded then pulled back, so ascenders and descenders
        // survive; clipping tight to the line box shears the glyphs.
        <span
          key={i}
          className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "116%" }}
            animate={inView ? { y: 0 } : { y: "116%" }}
            transition={{
              duration: 0.9,
              ease: easeOut,
              delay: delay + i * 0.055,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
