"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { problems } from "@/lib/content";
import { RevealWords } from "./Reveal";
import LeakyFunnel from "./LeakyFunnel";

function ProblemRow({
  item,
  index,
  progress,
}: {
  item: (typeof problems)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  // Each row owns a slice of the section's scroll range and lights up inside it.
  const total = problems.length;
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(
    progress,
    [start - 0.14, start + 0.03, end - 0.03, end + 0.12],
    [0.22, 1, 1, 0.22],
  );
  const x = useTransform(progress, [start - 0.1, start + 0.05], [18, 0]);

  return (
    <motion.li style={{ opacity, x }} className="relative py-9 sm:py-12">
      <div className="flex items-baseline gap-4">
        <span className="mono shrink-0 text-3xl font-semibold tabular-nums text-white sm:text-4xl">
          {item.stat}
        </span>
        <span className="mono text-[10px] uppercase tracking-[0.2em] text-[#4f6bff]">
          0{index + 1}
        </span>
      </div>
      <h3 className="mt-2.5 text-xl font-semibold tracking-tight sm:text-2xl">
        {item.label}
      </h3>
      <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-[var(--text-dim)]">
        {item.body}
      </p>
      <div className="hairline mt-9 h-px w-full opacity-40" />
    </motion.li>
  );
}

export default function Problems() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.72", "end 0.72"],
  });

  return (
    <section
      id="problem"
      ref={ref}
      className="relative border-t border-[var(--glass-border)] px-5 py-24 sm:px-6 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-3xl sm:mb-24">
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#22d3ee]">
            The problem
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            <RevealWords text="Your pipeline is leaking. You just can't see where." />
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--text-dim)]">
            Every business we audit has the same five failures. None of them are
            a marketing problem — they're a systems problem.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
          {/* Sticky funnel — drains as the reader moves through the failures. */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <LeakyFunnel progress={scrollYProgress} />
            </div>
          </div>

          <ul className="lg:pt-4">
            {problems.map((p, i) => (
              <ProblemRow
                key={p.label}
                item={p}
                index={i}
                progress={scrollYProgress}
              />
            ))}
            <li className="pt-10">
              <div className="glass glass-refract sheen rounded-2xl p-7">
                <p className="text-[17px] font-medium leading-relaxed">
                  Kingsberry Consulting fixes all five — with AI and automation,
                  built directly into the tools you already pay for.
                </p>
                <a
                  href="#services"
                  className="group mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[#7ea6ff]"
                >
                  See the system
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
