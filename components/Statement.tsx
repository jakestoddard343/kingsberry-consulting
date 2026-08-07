"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { site } from "@/lib/content";

/**
 * Full-bleed positioning statement. Each word brightens as it passes the
 * middle of the viewport — a scroll-scrubbed read-through.
 */
export default function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });

  const words = site.positioning.split(" ");

  return (
    <section className="relative border-t border-[var(--glass-border)] px-5 py-28 sm:px-6 sm:py-40">
      <div ref={ref} className="mx-auto max-w-4xl">
        <span className="mono mb-8 block text-[11px] uppercase tracking-[0.2em] text-[#a855f7]">
          Positioning
        </span>
        <p className="flex flex-wrap text-balance text-[1.75rem] font-medium leading-[1.25] tracking-[-0.028em] sm:text-[2.6rem] lg:text-[3.1rem]">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2.5 text-[15px] font-semibold text-white"
          >
            Start with a free audit
            <span className="grid h-7 w-7 place-items-center rounded-full border border-[var(--glass-border)] transition-all duration-300 group-hover:border-white/40 group-hover:bg-white group-hover:text-[#04060d]">
              →
            </span>
          </a>
          <p className="text-[14px] text-[var(--text-faint)]">
            {site.subPositioning}
          </p>
        </div>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.28em]">
      {children}
    </motion.span>
  );
}
