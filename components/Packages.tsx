"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { capabilities, packages, retainer } from "@/lib/content";
import Reveal, { RevealWords } from "./Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 ${className}`}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 7.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Resolve a set of checked capabilities to a recommendation.
 *
 * The package is the highest tier touched — the smallest engagement that still
 * covers everything asked for. Ongoing items live outside that ladder and only
 * attach the retainer.
 */
function recommend(selected: Set<string>) {
  const chosen = capabilities.filter((c) => selected.has(c.id));
  const wantsOngoing = chosen.some((c) => c.ongoing);
  const tiers = chosen.map((c) => c.tier).filter((t): t is 1 | 2 | 3 => !!t);

  const pkg = tiers.length
    ? packages.find((p) => p.tier === Math.max(...tiers))
    : undefined;

  return { pkg, wantsOngoing, count: chosen.length };
}

function Option({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      // The input is visually hidden, so the ring has to come from the label.
      className={`glass sheen group flex cursor-pointer items-start gap-3 rounded-xl px-4 py-3.5 transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#4f6bff]/70 ${
        checked ? "bg-[#4f6bff]/14" : "hover:bg-white/[0.06]"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-px grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[6px] border transition-all duration-300 ${
          checked
            ? "border-transparent bg-white text-[#04060d]"
            : "border-white/25 text-transparent group-hover:border-white/45"
        }`}
      >
        <AnimatePresence initial={false}>
          {checked && (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.22, ease }}
            >
              <Check />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span
        className={`text-[14.5px] leading-snug transition-colors duration-300 ${
          checked ? "text-white" : "text-[var(--text-dim)]"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

export default function Packages() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const { pkg, wantsOngoing, count } = useMemo(
    () => recommend(selected),
    [selected],
  );

  // Retainer-only selections still deserve an answer.
  const headline = pkg
    ? `Looks like you're interested in the ${pkg.name}.`
    : wantsOngoing
      ? `Looks like you're interested in the ${retainer.name}.`
      : null;

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
        <div className="mb-14 max-w-3xl sm:mb-16">
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#22d3ee]">
            Engagements
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            <RevealWords text="Tell us what you need." />
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--text-dim)]">
            Check off everything you want fixed. We&rsquo;ll show you which
            engagement covers it — and exactly what&rsquo;s inside.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
          {/* Picker */}
          <Reveal>
            <fieldset className="grid gap-2.5 sm:grid-cols-2">
              <legend className="sr-only">
                Select the outcomes you are interested in
              </legend>
              {capabilities.map((c) => (
                <Option
                  key={c.id}
                  label={c.label}
                  checked={selected.has(c.id)}
                  onToggle={() => toggle(c.id)}
                />
              ))}
            </fieldset>

            <div className="mt-4 flex items-center justify-between gap-4 px-1">
              <span className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                {count} selected
              </span>
              {count > 0 && (
                <button
                  onClick={() => setSelected(new Set())}
                  className="text-[13px] text-[var(--text-dim)] underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </Reveal>

          {/* Result */}
          <Reveal delay={0.08}>
            <div className="lg:sticky lg:top-28">
              <motion.div
                layout
                transition={{ layout: { duration: 0.45, ease } }}
                className="glass glass-refract sheen overflow-hidden rounded-2xl p-7"
              >
                <AnimatePresence mode="wait">
                  {!headline ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex min-h-[280px] flex-col justify-center text-center"
                    >
                      <span
                        aria-hidden="true"
                        className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-dashed border-white/20 text-[var(--text-faint)]"
                      >
                        <Check className="h-5 w-5" />
                      </span>
                      <p className="mt-5 text-[15px] font-medium">
                        Pick a few outcomes
                      </p>
                      <p className="mx-auto mt-2 max-w-[15rem] text-[13.5px] leading-relaxed text-[var(--text-dim)]">
                        Your recommended engagement appears here as you select.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      // Re-keying on the match re-runs the entrance whenever
                      // the recommendation actually changes.
                      key={pkg?.id ?? retainer.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.45, ease }}
                    >
                      <span className="mono text-[10px] uppercase tracking-[0.18em] text-[#34e5b0]">
                        Your match
                      </span>

                      <p
                        aria-live="polite"
                        className="mt-4 text-balance text-[21px] font-semibold leading-snug tracking-tight sm:text-[23px]"
                      >
                        Looks like you&rsquo;re interested in the{" "}
                        <span className="text-gradient">
                          {pkg?.name ?? retainer.name}
                        </span>
                        .
                      </p>

                      <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--text-dim)]">
                        {pkg?.pitch ?? retainer.pitch}
                      </p>

                      <div className="mt-6 border-t border-[var(--glass-border)] pt-6">
                        <h3 className="mono mb-3.5 text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                          What&rsquo;s included
                        </h3>
                        <ul className="space-y-2.5">
                          {(pkg?.includes ?? retainer.includes).map((inc) => (
                            <li key={inc} className="flex gap-2.5 text-[14px]">
                              <Check className="mt-[3px] text-[#34e5b0]" />
                              <span className="text-[rgba(233,238,255,0.8)]">
                                {inc}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Ongoing picks attach the retainer without changing the tier. */}
                      <AnimatePresence>
                        {pkg && wantsOngoing && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease }}
                            className="overflow-hidden"
                          >
                            <div className="mt-5 rounded-xl border border-[#34e5b0]/25 bg-[#34e5b0]/[0.07] p-4">
                              <p className="text-[13.5px] leading-relaxed text-[rgba(233,238,255,0.82)]">
                                You also picked ongoing work — pair it with the{" "}
                                <strong className="font-semibold text-white">
                                  {retainer.name}
                                </strong>{" "}
                                so the system stays tuned after launch.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {pkg && (
                        <div className="mono mt-6 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                          Built for · {pkg.target}
                        </div>
                      )}

                      <a
                        href="#contact"
                        className="group relative mt-5 block overflow-hidden rounded-xl bg-white px-6 py-3.5 text-center text-[14.5px] font-semibold text-[#04060d] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]"
                      >
                        <span className="relative z-10">
                          Get a quote for this
                        </span>
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      </a>

                      <p className="mt-3.5 text-center text-[12px] leading-relaxed text-[var(--text-faint)]">
                        Scoped and quoted after a free audit — no surprise
                        scope, no open-ended retainer to start.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
