"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services, type Service } from "@/lib/content";
import { usePinnedSteps } from "@/lib/use-pinned-steps";
import { usePeak, useFlyIn, useLandedOnce } from "@/lib/use-fly-in";
import { RevealWords } from "./Reveal";
import FlyIn from "./FlyIn";
import ServiceDemo from "./ServiceDemo";

const ease = [0.16, 1, 0.3, 1] as const;

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-[var(--glass-border)] bg-white/[0.04] px-2 py-1 text-[11px] text-[var(--text-dim)]">
      {children}
    </span>
  );
}

function ServiceCard({
  service,
  open,
  onToggle,
  landed,
}: {
  service: Service;
  open: boolean;
  onToggle: () => void;
  /** True once this card has arrived at rest — plays a one-shot preview of
   * its own hover state, so the entrance demonstrates it's clickable instead
   * of the copy merely asserting it. Undefined (mobile/reduced-motion
   * fallback) reads the same as false: no replay, card just sits still. */
  landed?: boolean;
}) {
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      layout
      onMouseMove={handleMove}
      transition={{ layout: { duration: 0.5, ease } }}
      className={`glass sheen group relative flex h-full flex-col overflow-hidden rounded-2xl transition-colors duration-500 ${
        open ? "glass-refract" : "hover:bg-white/[0.055]"
      }`}
    >
      {/* One-shot sweep on arrival — same idiom as the hero CTA's hover
          sheen (Hero.tsx), just played once instead of on :hover. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-120%" }}
        animate={landed ? { x: "120%" } : { x: "-120%" }}
        transition={{ duration: 0.7, ease }}
      />

      <motion.div
        animate={landed ? { y: [0, -6, 0] } : { y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex flex-1 flex-col"
      >
        <button
          onClick={onToggle}
          aria-expanded={open}
          className="w-full flex-1 cursor-pointer p-5 text-left"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="mono text-[11px] tracking-[0.2em] text-[#4f6bff]">
              {service.n}
            </span>
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={landed ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 17 }}
              className="relative shrink-0"
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full border border-[var(--glass-border)] text-[var(--text-dim)] transition-all duration-500 ${
                  open ? "rotate-45 bg-white text-[#04060d]" : "group-hover:border-white/30"
                }`}
                aria-hidden="true"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M5 1v8M1 5h8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {/* One-shot ping — same shape as the AutomationFlow active-step
                  ring, but plays once on landing rather than looping forever. */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-[#7ea6ff]"
                initial={{ scale: 1, opacity: 0 }}
                animate={landed ? { scale: 2.1, opacity: [0.9, 0] } : { scale: 1, opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              />
            </motion.span>
          </div>

          <h3 className="mt-3 text-[15.5px] font-semibold leading-snug tracking-tight">
            {service.title}
          </h3>
          <p className="mt-1.5 text-[12.5px] leading-snug text-[var(--text-dim)]">
            {service.summary}
          </p>
        </button>
      </motion.div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--glass-border)] px-6 pb-7 pt-6 sm:px-7">
              <p className="max-w-2xl text-[15px] leading-relaxed text-[rgba(233,238,255,0.78)]">
                {service.detail}
              </p>

              <div className="mt-6">
                <ServiceDemo id={service.id} />
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="mono mb-3 text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    What we build
                  </h4>
                  <ul className="space-y-2">
                    {service.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-2.5 text-[14px] text-[var(--text-dim)]"
                      >
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#34e5b0]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mono mb-3 text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    Deliverables
                  </h4>
                  <ul className="space-y-2">
                    {service.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex gap-2.5 text-[14px] text-[var(--text-dim)]"
                      >
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#7ea6ff]" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {service.tools.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** One card's fly-in: alternates which edge it arrives from by column, so the
 * 4x2 grid reads as converging toward the center rather than sliding in as a
 * block. Windows overlap (~0.32 wide, offset 0.075) so several cards are
 * always mid-flight instead of popping in one at a time. */
function useCardFlyIn(peak: ReturnType<typeof usePeak>, i: number) {
  const col = i % 4;
  const from = i * 0.075;
  const to = from + 0.32;
  const xDir = col < 2 ? -1 : 1;

  const style = useFlyIn(peak, { from, to, x: xDir * 170, rotateY: xDir * 18 });
  const landed = useLandedOnce(peak, from + (to - from) * 0.85);

  return { style, landed };
}

export default function Services() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { sectionRef, pinRef, progressMV, scrubbed, pinned } = usePinnedSteps(1, {
    stepVh: 110,
    tailVh: 28,
  });
  const peak = usePeak(progressMV);

  // Rules of Hooks needs a fixed, unconditional call order, so the eight
  // per-card fly-ins are unrolled here rather than called inside the render
  // map below. `services` is a fixed eight-item array in lib/content.ts —
  // if that count ever changes, this list needs to grow with it.
  const cardFlyIns = [
    useCardFlyIn(peak, 0),
    useCardFlyIn(peak, 1),
    useCardFlyIn(peak, 2),
    useCardFlyIn(peak, 3),
    useCardFlyIn(peak, 4),
    useCardFlyIn(peak, 5),
    useCardFlyIn(peak, 6),
    useCardFlyIn(peak, 7),
  ];

  // The pin spacer's height is captured when the pin is created; an expanding
  // card grows the section without that being re-measured, so whatever
  // follows would overlap it until the next resize.
  useEffect(() => {
    if (!scrubbed) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [openId, scrubbed]);

  // An open card is ~450px of detail plus a live demo — opening one mid-pin
  // would put most of it in the unreachable zone below the fold. The tail is
  // short, so this window is brief, and the alternative is content visible
  // but not reachable.
  const toggle = (id: string) => {
    if (pinned) return;
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative border-t border-[var(--glass-border)]"
    >
      {/* Soft field behind the grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(70% 45% at 50% 0%, rgba(79,107,255,0.16) 0%, transparent 70%)",
        }}
      />

      <div ref={pinRef} className="relative px-5 py-16 sm:px-6 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#22d3ee]">
              What we build
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl lg:text-[2.4rem]">
              <RevealWords text="Eight systems. One revenue machine." />
            </h2>
            <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-[var(--text-dim)]">
              Most agencies can run ads. Far fewer can redesign your entire
              lead-generation and follow-up system. Tap any card to see the build.
            </p>
          </div>

          <LayoutGroup>
            <div
              className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-4"
              style={{ perspective: 1200 }}
            >
              {services.map((s, i) => {
                const { style, landed } = cardFlyIns[i];
                const open = openId === s.id;
                return (
                  <FlyIn
                    key={s.id}
                    style={scrubbed ? style : undefined}
                    delay={Math.min(i, 3) * 0.06}
                    className={`h-full ${open ? "lg:col-span-4" : ""}`}
                  >
                    <ServiceCard
                      service={s}
                      open={open}
                      onToggle={() => toggle(s.id)}
                      landed={scrubbed ? landed : true}
                    />
                  </FlyIn>
                );
              })}
            </div>
          </LayoutGroup>
        </div>
      </div>
    </section>
  );
}
