"use client";

import { motion, AnimatePresence } from "motion/react";
import { problems } from "@/lib/content";
import { usePinnedSteps } from "@/lib/use-pinned-steps";
import { RevealWords } from "./Reveal";
import LeakyFunnel from "./LeakyFunnel";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Pinned single-screen section: the funnel drains on the left while the five
 * failures advance one at a time on the right.
 *
 * Previously this ran as a tall scrolling list with a sticky funnel, which was
 * several viewports deep. Showing one failure at a time keeps the whole thing
 * inside a single screen and lets the funnel stay in view for every one of
 * them — the drain only reads as cause-and-effect if you can see it happen.
 */
export default function Problems() {
  const { sectionRef, pinRef, active, progress, scrubbed } = usePinnedSteps(
    problems.length,
  );
  const current = Math.max(0, active);
  const item = problems[current];

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative border-t border-[var(--glass-border)]"
    >
      <div
        ref={pinRef}
        className="flex min-h-[100svh] flex-col justify-center px-5 py-14 sm:px-6 sm:py-16"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6 max-w-3xl">
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#22d3ee]">
              The problem
            </span>
            <h2 className="mt-2.5 text-balance text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-3xl lg:text-[2.3rem]">
              <RevealWords text="Your pipeline is leaking. You just can't see where." />
            </h2>
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-[var(--text-dim)]">
              Every business we audit has the same five failures. None of them
              are a marketing problem — they&rsquo;re a systems problem.
            </p>
          </div>

          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:gap-14">
            <div className="mx-auto w-full max-w-[230px] lg:mx-0">
              <LeakyFunnel progress={scrubbed ? progress : 1} />
            </div>

            {/* Desktop: one failure at a time, driven by the scrub. */}
            {scrubbed ? (
              <div className="hidden lg:block">
                <div className="min-h-[188px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.38, ease }}
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="mono text-4xl font-semibold tabular-nums text-white">
                          {item.stat}
                        </span>
                        <span className="mono text-[11px] tracking-[0.2em] text-[#4f6bff]">
                          0{current + 1} / 0{problems.length}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold tracking-tight">
                        {item.label}
                      </h3>
                      <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-[var(--text-dim)]">
                        {item.body}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* All five stay visible as ticks, so the length is knowable. */}
                <ul className="mt-6 flex gap-2">
                  {problems.map((p, i) => (
                    <li key={p.label} className="flex-1">
                      <span
                        className={`block h-[3px] rounded-full transition-colors duration-300 ${
                          i <= current ? "bg-[#7ea6ff]" : "bg-white/12"
                        }`}
                      />
                      <span
                        className={`mono mt-2 block truncate text-[9.5px] uppercase tracking-[0.12em] transition-colors duration-300 ${
                          i === current ? "text-white" : "text-[var(--text-faint)]"
                        }`}
                      >
                        {p.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="glass glass-refract sheen mt-6 rounded-2xl px-5 py-4">
                  <p className="text-[14px] leading-relaxed">
                    Kingsberry Consulting fixes all five — with AI and
                    automation, built into the tools you already pay for.
                  </p>
                </div>
              </div>
            ) : (
              /* Mobile and reduced motion: the full list, no pin. */
              <ul className="space-y-7">
                {problems.map((p, i) => (
                  <li key={p.label}>
                    <div className="flex items-baseline gap-3">
                      <span className="mono text-2xl font-semibold tabular-nums text-white">
                        {p.stat}
                      </span>
                      <span className="mono text-[10px] tracking-[0.2em] text-[#4f6bff]">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-lg font-semibold tracking-tight">
                      {p.label}
                    </h3>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--text-dim)]">
                      {p.body}
                    </p>
                  </li>
                ))}
                <li className="glass glass-refract rounded-2xl p-6">
                  <p className="text-[14px] leading-relaxed">
                    Kingsberry Consulting fixes all five — with AI and
                    automation, built into the tools you already pay for.
                  </p>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
