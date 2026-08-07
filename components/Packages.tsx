"use client";

import { motion } from "motion/react";
import { packages, retainer } from "@/lib/content";
import Reveal, { RevealWords } from "./Reveal";

function Check() {
  return (
    <svg
      className="mt-[3px] h-3.5 w-3.5 shrink-0 text-[#34e5b0]"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 7.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Packages() {
  return (
    <section
      id="packages"
      className="relative border-t border-[var(--glass-border)] px-5 py-24 sm:px-6 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 100%, rgba(168,85,247,0.14) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 max-w-3xl sm:mb-20">
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#22d3ee]">
            Engagements
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            <RevealWords text="Productized. Priced up front." />
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--text-dim)]">
            No open-ended retainers to start and no surprise scope. Pick the tier
            that matches where you are.
          </p>
        </div>

        {/* Rows stretch so the three CTAs land on the same baseline. */}
        <div className="grid gap-4 lg:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.09} className="h-full">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`glass sheen relative flex h-full flex-col overflow-hidden rounded-2xl p-7 ${
                  p.featured ? "glass-refract" : ""
                }`}
              >
                {p.featured && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7ea6ff] to-transparent"
                    />
                    <span className="mono absolute right-5 top-5 rounded-full border border-[#4f6bff]/40 bg-[#4f6bff]/12 px-2.5 py-1 text-[9.5px] uppercase tracking-[0.14em] text-[#9db4ff]">
                      Most popular
                    </span>
                  </>
                )}

                <h3 className="max-w-[75%] text-[19px] font-semibold leading-snug tracking-tight">
                  {p.name}
                </h3>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="mono text-[26px] font-semibold tracking-tight text-white sm:text-[28px]">
                    {p.price}
                  </span>
                </div>
                <span className="mono mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  {p.cadence}
                </span>

                <p className="mt-5 text-[14.5px] leading-relaxed text-[var(--text-dim)]">
                  {p.pitch}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5 border-t border-[var(--glass-border)] pt-6">
                  {p.includes.map((inc) => (
                    <li key={inc} className="flex gap-2.5 text-[14px]">
                      <Check />
                      <span className="text-[rgba(233,238,255,0.8)]">{inc}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <div className="mono mb-4 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                    Built for · {p.target}
                  </div>
                  <a
                    href="#contact"
                    className={`block rounded-xl px-5 py-3 text-center text-[14px] font-semibold transition-all duration-300 ${
                      p.featured
                        ? "bg-white text-[#04060d] hover:scale-[1.02]"
                        : "border border-[var(--glass-border)] text-white hover:bg-white/[0.07]"
                    }`}
                  >
                    Start here
                  </a>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Recurring retainer */}
        <Reveal delay={0.1}>
          <div className="glass glass-refract sheen mt-4 overflow-hidden rounded-2xl p-7 sm:p-9">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
              <div>
                <span className="mono text-[10px] uppercase tracking-[0.18em] text-[#34e5b0]">
                  Ongoing partnership
                </span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {retainer.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="mono text-[28px] font-semibold tracking-tight text-white">
                    {retainer.price}
                  </span>
                  <span className="text-[13px] text-[var(--text-faint)]">
                    {retainer.cadence}
                  </span>
                </div>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--text-dim)]">
                  {retainer.pitch}
                </p>
              </div>

              <div>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {retainer.includes.map((inc) => (
                    <li key={inc} className="flex gap-2.5 text-[14px]">
                      <Check />
                      <span className="text-[rgba(233,238,255,0.8)]">{inc}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="mt-7 inline-block rounded-xl bg-white px-6 py-3 text-[14px] font-semibold text-[#04060d] transition-transform duration-300 hover:scale-[1.03]"
                >
                  Talk about a retainer
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
