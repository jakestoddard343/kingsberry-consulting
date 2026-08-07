"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { services, type Service } from "@/lib/content";
import Reveal, { RevealWords } from "./Reveal";
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
}: {
  service: Service;
  open: boolean;
  onToggle: () => void;
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
      className={`glass sheen group relative overflow-hidden rounded-2xl transition-colors duration-500 ${
        open ? "glass-refract" : "hover:bg-white/[0.055]"
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full cursor-pointer p-6 text-left sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="mono text-[11px] tracking-[0.2em] text-[#4f6bff]">
            {service.n}
          </span>
          <span
            className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--glass-border)] text-[var(--text-dim)] transition-all duration-500 ${
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
        </div>

        <h3 className="mt-4 text-[19px] font-semibold leading-snug tracking-tight sm:text-xl">
          {service.title}
        </h3>
        <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--text-dim)]">
          {service.summary}
        </p>
      </button>

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

export default function Services() {
  const [openId, setOpenId] = useState<string | null>(services[0].id);

  return (
    <section
      id="services"
      className="relative border-t border-[var(--glass-border)] px-5 py-24 sm:px-6 sm:py-32"
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

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 max-w-3xl sm:mb-20">
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#22d3ee]">
            What we build
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            <RevealWords text="Eight systems. One revenue machine." />
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--text-dim)]">
            Most agencies can run ads. Far fewer can redesign your entire
            lead-generation and follow-up system. Tap any card to see the build.
          </p>
        </div>

        <LayoutGroup>
          {/* items-start keeps an expanded card from stretching its neighbour. */}
          <div className="grid items-start gap-4 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={Math.min(i, 3) * 0.06}>
                <ServiceCard
                  service={s}
                  open={openId === s.id}
                  onToggle={() => setOpenId(openId === s.id ? null : s.id)}
                />
              </Reveal>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
