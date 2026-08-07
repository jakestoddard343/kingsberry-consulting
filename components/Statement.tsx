"use client";

import { site } from "@/lib/content";
import { usePinnedSteps } from "@/lib/use-pinned-steps";

/**
 * Full-bleed positioning statement, pinned while it reads itself in.
 *
 * The words brighten in sequence as you scroll, so the section has to hold
 * still or the sentence is half-lit by the time it leaves the screen. Pacing
 * is one long stretch rather than discrete steps — `count: 1` with a wide
 * stepVh — because the reveal is continuous, not stepwise.
 */
export default function Statement() {
  const { sectionRef, pinRef, progress, scrubbed } = usePinnedSteps(1, {
    stepVh: 160,
    tailVh: 55,
  });

  const words = site.positioning.split(" ");
  // Off-pin (mobile, reduced motion) the sentence is simply fully lit.
  const read = scrubbed ? progress : 1;

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-[var(--glass-border)]"
    >
      <div
        ref={pinRef}
        className="flex min-h-[100svh] flex-col justify-center px-5 py-24 sm:px-6"
      >
        <div className="mx-auto w-full max-w-4xl">
          <span className="mono mb-8 block text-[11px] uppercase tracking-[0.2em] text-[#a855f7]">
            Positioning
          </span>

          <p className="flex flex-wrap text-balance text-[1.75rem] font-medium leading-[1.25] tracking-[-0.028em] sm:text-[2.6rem] lg:text-[3.1rem]">
            {words.map((word, i) => {
              // Each word owns a slice of the read, with a short ramp so the
              // brightening sweeps rather than snapping word to word.
              const start = i / words.length;
              const lit = Math.min(
                1,
                Math.max(0, (read - start) / (1 / words.length)),
              );
              return (
                <span
                  key={i}
                  className="mr-[0.28em]"
                  style={{
                    opacity: 0.16 + lit * 0.84,
                    transition: "opacity 160ms linear",
                  }}
                >
                  {word}
                </span>
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
      </div>
    </section>
  );
}
