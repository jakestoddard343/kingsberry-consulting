"use client";

import { process } from "@/lib/content";
import { usePinnedSteps } from "@/lib/use-pinned-steps";
import { RevealWords } from "./Reveal";
import ProcessDemo from "./ProcessDemo";

/**
 * Pinned scroll-scrub section: the panel stays fixed while the five steps
 * advance under it. Pin and pacing live in usePinnedSteps.
 */
export default function Process() {
  const { sectionRef, pinRef, active, progress: fill, scrubbed } = usePinnedSteps(
    process.length,
  );
  // ScrollTrigger's onUpdate hasn't necessarily fired yet on first paint, so
  // `active` can still be its initial -1 — clamp for anything driven by it.
  const current = Math.max(0, active);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative border-t border-[var(--glass-border)]"
    >
      {/* pt-24 clears the nav's 112px blur scrim (h-28) — see Contact/Edge's
          equivalent note; short of that the heading renders washed-out
          underneath it for the whole time the section is pinned. Bottom
          padding stays lean since only the top edge fights the nav. */}
      <div ref={pinRef} className="px-5 pb-6 pt-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 max-w-3xl">
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#22d3ee]">
              How it works
            </span>
            <h2 className="mt-2.5 text-balance text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[2rem] lg:text-[2.3rem]">
              <RevealWords text="Audit. Design. Build. Measure. Optimize." />
            </h2>
          </div>

          {/* Progress rail */}
          <div className="relative mb-5 hidden h-px w-full bg-white/10 md:block">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4f6bff] via-[#a855f7] to-[#22d3ee] transition-[width] duration-150 ease-out"
              style={{ width: `${Math.max(2, fill * 100)}%` }}
            />
            <div className="absolute inset-0 flex justify-between">
              {process.map((s, i) => (
                <span
                  key={s.step}
                  className={`-mt-[3px] h-[7px] w-[7px] rounded-full transition-colors duration-300 ${
                    i <= active ? "bg-white" : "bg-white/25"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            {process.map((s, i) => {
              const isActive = i === active;
              const isPast = i < active;
              return (
                <div
                  key={s.step}
                  className={`glass relative overflow-hidden rounded-2xl p-4 transition-all duration-500 ${
                    isActive
                      ? "glass-refract scale-[1.02] bg-white/[0.07]"
                      : isPast
                        ? "opacity-55"
                        : "opacity-40"
                  }`}
                >
                  <span
                    className={`mono text-[11px] tracking-[0.2em] transition-colors duration-500 ${
                      isActive ? "text-[#7ea6ff]" : "text-[var(--text-faint)]"
                    }`}
                  >
                    {s.step}
                  </span>
                  <h3 className="mt-2 text-[15.5px] font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-snug text-[var(--text-dim)]">
                    {s.body}
                  </p>

                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7ea6ff] to-transparent"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3">
            <ProcessDemo active={current} progress={fill} scrubbed={scrubbed} />
          </div>
        </div>
      </div>
    </section>
  );
}
