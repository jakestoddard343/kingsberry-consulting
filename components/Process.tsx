"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { process } from "@/lib/content";
import { RevealWords } from "./Reveal";

/**
 * Pinned scroll-scrub section: the panel stays fixed while the five steps
 * advance under it. GSAP owns the pin, React owns the active index.
 */
export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !sectionRef.current || !pinRef.current) return;

    // Pinning at narrow widths fights mobile browser chrome; skip it there.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${process.length * 34}%`,
        pin: pinRef.current,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          setFill(p);
          const idx = Math.min(
            process.length - 1,
            Math.floor(p * process.length),
          );
          setActive(idx);
        },
      });

      return () => st.kill();
    });

    return () => mm.revert();
  }, []);

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
