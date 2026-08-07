"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import ShaderBackdrop from "./ShaderBackdrop";
import LiquidMark from "./LiquidMark";
import { site } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

const stats = [
  { v: "24/7", l: "Systems running" },
  { v: "< 5 min", l: "Lead response" },
  { v: "1 view", l: "Full-funnel ROI" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax: content drifts up and dissolves as the next section arrives.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pb-24 pt-32 sm:px-6"
    >
      <ShaderBackdrop />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto w-full max-w-5xl text-center"
      >
        {/* Brand mark in liquid metal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease, delay: 0.1 }}
          // Large enough to be the thing you reach for: the shader only reads
          // as a liquid you can push around if there is something to push.
          className="mx-auto mb-6 h-48 w-48 cursor-grab active:cursor-grabbing sm:h-64 sm:w-64 lg:h-72 lg:w-72"
        >
          <LiquidMark className="h-full w-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.25 }}
          className="mx-auto mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--glass-border)] bg-white/[0.04] px-4 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34e5b0] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34e5b0]" />
          </span>
          <span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-dim)]">
            {site.tagline}
          </span>
        </motion.div>

        <h1 className="mx-auto max-w-4xl text-balance text-[2.6rem] font-semibold leading-[1.03] tracking-[-0.035em] sm:text-6xl lg:text-[4.6rem]">
          {["Turn marketing into", "measurable revenue."].map((line, li) => (
            <span
              key={li}
              className="-mb-[0.14em] block overflow-hidden pb-[0.14em]"
            >
              <motion.span
                className={`inline-block ${li === 1 ? "text-gradient" : ""}`}
                initial={{ y: "112%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease, delay: 0.35 + li * 0.11 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.62 }}
          className="mx-auto mt-7 max-w-2xl text-pretty text-[17px] leading-relaxed text-[var(--text-dim)] sm:text-lg"
        >
          Kingsberry Consulting builds automated lead-generation systems that
          work 24/7 — AI, marketing automation, CRM optimization, and analytics,
          assembled into one machine you can actually measure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.74 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#contact"
            className="group relative w-full overflow-hidden rounded-xl bg-white px-7 py-3.5 text-[15px] font-semibold text-[#04060d] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] sm:w-auto"
          >
            <span className="relative z-10">Get a free lead-funnel audit</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
          <a
            href="#services"
            className="glass sheen w-full rounded-xl px-7 py-3.5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-white/[0.07] sm:w-auto"
          >
            See what we build
          </a>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.95 }}
          className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-white/[0.05]"
        >
          {stats.map((s) => (
            <div key={s.l} className="bg-[#04060d]/60 px-3 py-5 backdrop-blur-sm">
              <dt className="mono text-lg font-semibold tracking-tight text-white sm:text-xl">
                {s.v}
              </dt>
              <dd className="mt-1 text-[11px] uppercase tracking-wider text-[var(--text-faint)]">
                {s.l}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-9 w-[22px] justify-center rounded-full border border-white/20 pt-2">
          <motion.span
            animate={{ y: [0, 9, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-px rounded-full bg-white/70"
          />
        </div>
      </motion.div>
    </section>
  );
}
