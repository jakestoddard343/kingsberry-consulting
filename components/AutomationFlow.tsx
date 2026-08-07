"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealWords } from "./Reveal";

const steps = [
  { t: "Lead submits form", s: "Website" },
  { t: "CRM record created", s: "Salesforce" },
  { t: "Lead scored & routed", s: "AI model" },
  { t: "Rep assigned + alerted", s: "Slack" },
  { t: "Follow-up email sent", s: "HubSpot" },
  { t: "Meeting booked", s: "Calendar" },
];

const STEP_MS = 1150;

export default function AutomationFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { margin: "-20% 0px -20% 0px" });

  const [active, setActive] = useState(-1);
  const [fill, setFill] = useState(0);
  // True once ScrollTrigger owns `active`, so the timer path stands down.
  const [scrubbed, setScrubbed] = useState(false);

  // Desktop: pin the section and drive the chain from scroll position, so the
  // reader cannot scroll past a half-finished sequence. Pinning at narrow
  // widths fights mobile browser chrome, so phones keep the timed loop below.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!sectionRef.current || !pinRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.registerPlugin(ScrollTrigger);
      setScrubbed(true);

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${steps.length * 30}%`,
        pin: pinRef.current,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => {
          setFill(self.progress);
          setActive(
            Math.min(steps.length - 1, Math.floor(self.progress * steps.length)),
          );
        },
      });

      return () => {
        st.kill();
        setScrubbed(false);
      };
    });

    return () => mm.revert();
  }, []);

  // Mobile and reduced-motion fallback: advance on a timer while on screen.
  useEffect(() => {
    if (scrubbed) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(steps.length - 1);
      setFill(1);
      return;
    }
    if (!inView) return;

    const id = window.setInterval(() => {
      setActive((prev) => (prev >= steps.length - 1 ? 0 : prev + 1));
    }, STEP_MS);

    return () => window.clearInterval(id);
  }, [inView, scrubbed]);

  // Scrubbing gives a continuous value; the timer path steps discretely.
  const railWidth = scrubbed
    ? Math.min(1, fill * 1.06) * 100
    : ((active + 1) / steps.length) * 100;

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-[var(--glass-border)]"
    >
      <div ref={pinRef} className="px-5 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-3xl">
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#34e5b0]">
            The fix
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            <RevealWords text="Six steps. Zero humans. Under a minute." />
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--text-dim)]">
            This is a single automation — one of dozens we wire into your stack.
            It runs every time, at 2am on a Sunday, without anyone remembering to
            do it.
          </p>
        </div>

        <div ref={cardRef} className="glass glass-refract rounded-3xl p-6 sm:p-10">
          <ol className="relative grid gap-4 lg:grid-cols-6 lg:gap-3">
            {/* Connecting rail (desktop) */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-[26px] hidden h-px bg-white/10 lg:block"
            >
              {scrubbed ? (
                // Scrub already tracks the pointer, so easing it again lags.
                <div
                  className="h-full bg-gradient-to-r from-[#4f6bff] via-[#a855f7] to-[#34e5b0]"
                  style={{ width: `${railWidth}%` }}
                />
              ) : (
                <motion.div
                  className="h-full bg-gradient-to-r from-[#4f6bff] via-[#a855f7] to-[#34e5b0]"
                  animate={{ width: `${railWidth}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              )}
            </div>

            {steps.map((step, i) => {
              const done = i <= active;
              return (
                <li key={step.t} className="relative flex gap-4 lg:block">
                  {/* Connecting rail (mobile) */}
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={`absolute left-[13px] top-8 h-[calc(100%+1rem)] w-px transition-colors duration-500 lg:hidden ${
                        i < active ? "bg-[#7ea6ff]" : "bg-white/10"
                      }`}
                    />
                  )}

                  <span
                    className={`relative z-10 grid h-[27px] w-[27px] shrink-0 place-items-center rounded-full border text-[10px] font-semibold transition-all duration-500 ${
                      done
                        ? "border-transparent bg-white text-[#04060d]"
                        : "border-[var(--glass-border)] bg-[#04060d] text-[var(--text-faint)]"
                    }`}
                  >
                    {i + 1}
                    {i === active && (
                      <motion.span
                        className="absolute inset-0 rounded-full border border-[#7ea6ff]"
                        initial={{ scale: 1, opacity: 0.9 }}
                        animate={{ scale: 2.1, opacity: 0 }}
                        transition={{ duration: 1.1, repeat: Infinity }}
                      />
                    )}
                  </span>

                  <div className="lg:mt-4 lg:pr-3">
                    <p
                      className={`text-[14.5px] font-medium leading-snug transition-colors duration-500 ${
                        done ? "text-white" : "text-[var(--text-faint)]"
                      }`}
                    >
                      {step.t}
                    </p>
                    <p className="mono mt-1.5 text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                      {step.s}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--glass-border)] pt-6">
            <p className="text-[14px] text-[var(--text-dim)]">
              Built once. Runs forever. Monitored monthly.
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34e5b0] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34e5b0]" />
              </span>
              <span className="mono text-[11px] uppercase tracking-[0.16em] text-[#34e5b0]">
                Live
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
