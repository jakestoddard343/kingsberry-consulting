"use client";

import { process } from "@/lib/content";
import { usePinnedSteps } from "@/lib/use-pinned-steps";
import { RevealWords } from "./Reveal";

/**
 * Pinned scroll-scrub section: the panel stays fixed while the five steps
 * advance under it. Pin and pacing live in usePinnedSteps.
 */
export default function Process() {
  const { sectionRef, pinRef, active, progress: fill } = usePinnedSteps(
    process.length,
  );

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative border-t border-[var(--glass-border)]"
    >
      <div ref={pinRef} className="px-5 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#22d3ee]">
              How it works
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
              <RevealWords text="Audit. Design. Build. Measure. Optimize." />
            </h2>
          </div>

          {/* Progress rail */}
          <div className="relative mb-10 hidden h-px w-full bg-white/10 md:block">
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
                  className={`glass relative overflow-hidden rounded-2xl p-6 transition-all duration-500 ${
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
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--text-dim)]">
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
        </div>
      </div>
    </section>
  );
}
