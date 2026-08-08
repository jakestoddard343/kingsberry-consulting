"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { projectOptions, packages, retainer } from "@/lib/content";
import { RevealWords } from "./Reveal";
import { useQuote } from "./QuoteProvider";
import { usePinnedSteps } from "@/lib/use-pinned-steps";
import { usePeak, useFlyIn, useLandedOnce } from "@/lib/use-fly-in";
import FlyIn from "./FlyIn";

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

/** A wrapped-row alternative to a bulleted list — same information, a fraction of the height. */
function Chip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "mint" | "blue";
}) {
  const toneClass =
    tone === "mint"
      ? "border-[#34e5b0]/30 bg-[#34e5b0]/10 text-[#34e5b0]"
      : "border-[#4f6bff]/30 bg-[#4f6bff]/10 text-[#9db4ff]";
  return (
    <span
      className={`rounded-md border px-2 py-1 text-[11.5px] leading-none ${toneClass}`}
    >
      {children}
    </span>
  );
}

/**
 * The matched package is the highest tier checked — the smallest engagement
 * that still covers everything selected. The retainer is deliberately not part
 * of this ladder; it is added on its own and never changes which package fits.
 */
function matchPackage(selected: Set<string>) {
  const tiers = projectOptions
    .filter((o) => selected.has(o.id))
    .map((o) => o.tier);
  return tiers.length
    ? packages.find((p) => p.tier === Math.max(...tiers))
    : undefined;
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
      className={`glass sheen group flex cursor-pointer items-start gap-3 rounded-xl px-3.5 py-1.5 transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#4f6bff]/70 ${
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
        className={`text-[13.5px] leading-snug transition-colors duration-300 ${
          checked ? "text-white" : "text-[var(--text-dim)]"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

/** The continuous-improvement loop running in the retainer column. */
function Cycle() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setStep((s) => (s + 1) % retainer.cycle.length),
      1400,
    );
    return () => window.clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} className="flex flex-wrap items-center gap-1.5">
      {retainer.cycle.map((label, i) => (
        <span key={label} className="flex items-center gap-1.5">
          <span
            className={`mono rounded-md px-2 py-1 text-[10px] uppercase tracking-[0.14em] transition-all duration-500 ${
              i === step
                ? "bg-[#34e5b0]/18 text-[#34e5b0]"
                : "text-[var(--text-faint)]"
            }`}
          >
            {label}
          </span>
          {i < retainer.cycle.length - 1 && (
            <span aria-hidden="true" className="text-[10px] text-[var(--text-faint)]">
              →
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export default function Packages() {
  const {
    selected,
    toggle,
    clear,
    otherOn,
    toggleOther,
    otherText,
    setOtherText,
    wantsRetainer,
    toggleRetainer,
  } = useQuote();

  const listRef = useRef<HTMLDivElement>(null);
  const listInViewFallback = useInView(listRef, { once: true, margin: "-12% 0px" });

  const pkg = useMemo(() => matchPackage(selected), [selected]);
  const empty = !pkg && !wantsRetainer && !otherOn;

  // Whichever engagement leads the summary headline.
  const lead = pkg ?? (wantsRetainer ? retainer : undefined);

  // Interactive, so unlike Services there's nothing here to gate while
  // pinned — the section already fits one screen in every selection state,
  // empty or fully checked, so checkboxes and the retainer toggle stay live
  // through the whole entrance.
  const { sectionRef, pinRef, progressMV, scrubbed } = usePinnedSteps(1, {
    stepVh: 75,
    tailVh: 25,
  });
  const peak = usePeak(progressMV);

  // Three columns converge from alternating edges — left and right lean in
  // with a 3D tilt, the retainer pitch rises up the middle — with overlapping
  // windows so all three are in motion together rather than arriving in turn.
  const col1From = 0;
  const col1To = 0.42;
  const col1Fly = useFlyIn(peak, { from: col1From, to: col1To, x: -220, rotateY: -20 });
  const col2Fly = useFlyIn(peak, { from: 0.14, to: 0.58, y: 120 });
  const col3Fly = useFlyIn(peak, { from: 0.28, to: 0.72, x: 220, rotateY: 20 });

  // The option rows inside column 1 stagger in on their own — re-gated on the
  // column's own arrival rather than the rows' individual viewport visibility,
  // or they'd animate while the column carrying them is still off-screen.
  const col1Landed = useLandedOnce(peak, col1From + (col1To - col1From) * 0.85);
  const listInView = scrubbed ? col1Landed : listInViewFallback;

  return (
    <section
      id="packages"
      ref={sectionRef}
      className="relative border-t border-[var(--glass-border)]"
    >
      {/* The centering/height treatment used to only kick in at lg (1024px)
          — the same breakpoint the 3-col grid below used for grid-cols-3.
          But the pin itself engages at md (768px, see usePinnedSteps), so
          the 768-1023px band got neither: no min-h/justify-center to
          absorb overflow, and the grid fell back to a single stacked
          column, which is far taller than one viewport while pinned (the
          bottom two columns were unreachable). Moving both to md: closes
          that gap. pt-24/pb-10 (not py-14) for the same nav-scrim
          clearance as the rest of the pinned sections. */}
      <div
        ref={pinRef}
        className="relative px-5 py-16 sm:px-6 md:flex md:min-h-[100svh] md:flex-col md:justify-center md:pb-10 md:pt-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 40% at 50% 100%, rgba(168,85,247,0.14) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-4 max-w-3xl">
          <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#22d3ee]">
            Engagements
          </span>
          <h2 className="mt-2.5 text-balance text-[1.8rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-3xl lg:text-[2.2rem]">
            <RevealWords text="Tell us what you need." />
          </h2>
          <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-[var(--text-dim)]">
            Check off what you want fixed. We&rsquo;ll show you which engagement
            covers it — and exactly what&rsquo;s inside.
          </p>
        </div>

        {/* The retainer column (02) carries far more copy — pitch, cycle,
            catch-all, five chips — than its siblings, so equal thirds makes
            it the tallest by a wide margin at the narrower end of md (see
            the pinned-height note above). Give it more of the row instead
            of splitting evenly. */}
        <div className="grid gap-5 md:grid-cols-[0.9fr_1.25fr_0.85fr] md:items-start">
          {/* ── Left: project options ─────────────────────────────────── */}
          <FlyIn style={scrubbed ? col1Fly : undefined}>
            <div className="flex items-baseline justify-between gap-3 px-1 pb-3">
              <h3 className="mono text-[10px] uppercase tracking-[0.18em] text-[#7ea6ff]">
                01 · The project
              </h3>
              <AnimatePresence>
                {(selected.size > 0 || otherOn) && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={clear}
                    className="text-[12.5px] text-[var(--text-dim)] underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    Clear
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <fieldset
              ref={listRef as React.RefObject<never>}
              // Two sub-columns only in the true (unpinned) mobile range —
              // once md's 3-column layout narrows this column to a third of
              // the row, splitting it again into two makes every label wrap,
              // which was actively fighting the pinned-height budget.
              className="grid gap-1 sm:grid-cols-2 md:grid-cols-1"
            >
              <legend className="sr-only">
                Select the project outcomes you are interested in
              </legend>
              {projectOptions.map((o, i) => (
                <motion.div
                  key={o.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={listInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, ease, delay: i * 0.055 }}
                >
                  <Option
                    label={o.label}
                    checked={selected.has(o.id)}
                    onToggle={() => toggle(o.id)}
                  />
                </motion.div>
              ))}

              {/* Escape hatch. Outside the tier ladder, so it never sets a
                  package on its own — it just rides along to the form. */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={listInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.45,
                  ease,
                  delay: projectOptions.length * 0.055,
                }}
              >
                <Option
                  label="Something else"
                  checked={otherOn}
                  onToggle={toggleOther}
                />
                <AnimatePresence>
                  {otherOn && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="overflow-hidden"
                    >
                      <input
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                        placeholder="Tell us what you need…"
                        aria-label="Describe what else you need"
                        className="mt-2 w-full rounded-xl border border-[var(--glass-border)] bg-white/[0.035] px-4 py-3 text-[14px] text-white outline-none transition-all duration-300 placeholder:text-[rgba(233,238,255,0.28)] focus:border-[#4f6bff]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#4f6bff]/25"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </fieldset>
          </FlyIn>

          {/* ── Centre: the retainer pitch ────────────────────────────── */}
          <FlyIn style={scrubbed ? col2Fly : undefined} delay={0.07}>
            <div className="px-1 pb-3">
              <h3 className="mono text-[10px] uppercase tracking-[0.18em] text-[#34e5b0]">
                02 · The partnership
              </h3>
            </div>

            <div
              className={`glass glass-refract sheen relative overflow-hidden rounded-2xl p-4 transition-colors duration-500 ${
                wantsRetainer ? "bg-[#34e5b0]/[0.07]" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#34e5b0]/70 to-transparent"
              />

              <span className="mono text-[10px] uppercase tracking-[0.18em] text-[#34e5b0]">
                {retainer.eyebrow}
              </span>
              <h4 className="mt-2 text-balance text-[18px] font-semibold leading-snug tracking-tight">
                {retainer.headline}
              </h4>
              <p className="mt-1 text-[13px] font-medium text-[#34e5b0]">
                {retainer.name}
              </p>

              <p className="mt-2.5 text-[13px] leading-snug text-[var(--text-dim)]">
                {retainer.pitch}
              </p>

              <div className="mt-3">
                <Cycle />
              </div>

              <p className="mt-3 text-[13px] leading-snug text-[rgba(233,238,255,0.75)]">
                <span className="font-medium text-[#34e5b0]">Catch-all: </span>
                {retainer.catchAll}
              </p>

              <ul className="mt-3 flex flex-wrap gap-1.5 border-t border-[var(--glass-border)] pt-3">
                {retainer.includes.map((inc) => (
                  <li key={inc}>
                    <Chip tone="mint">{inc}</Chip>
                  </li>
                ))}
              </ul>

              <button
                onClick={toggleRetainer}
                aria-pressed={wantsRetainer}
                className={`mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl px-5 py-2.5 text-[14px] font-semibold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#34e5b0]/70 focus-visible:outline-none ${
                  wantsRetainer
                    ? "bg-[#34e5b0] text-[#04060d] hover:brightness-105"
                    : "border border-[#34e5b0]/40 text-[#34e5b0] hover:bg-[#34e5b0]/12"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid h-[17px] w-[17px] place-items-center rounded-[5px] border transition-colors duration-300 ${
                    wantsRetainer
                      ? "border-transparent bg-[#04060d]/85 text-[#34e5b0]"
                      : "border-[#34e5b0]/50 text-transparent"
                  }`}
                >
                  <Check className="h-3 w-3" />
                </span>
                {wantsRetainer ? "Added to your quote" : "Add to my quote"}
              </button>
            </div>
          </FlyIn>

          {/* ── Right: quote summary ──────────────────────────────────── */}
          <FlyIn style={scrubbed ? col3Fly : undefined} delay={0.14}>
            <div className="px-1 pb-3">
              <h3 className="mono text-[10px] uppercase tracking-[0.18em] text-[#a855f7]">
                03 · Your quote
              </h3>
            </div>

            <div>
              <motion.div
                layout
                transition={{ layout: { duration: 0.45, ease } }}
                className="glass glass-refract sheen overflow-hidden rounded-2xl p-4"
              >
                <AnimatePresence mode="wait">
                  {empty ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex min-h-[260px] flex-col justify-center text-center"
                    >
                      <span
                        aria-hidden="true"
                        className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-dashed border-white/20 text-[var(--text-faint)]"
                      >
                        <Check className="h-5 w-5" />
                      </span>
                      <p className="mt-5 text-[15px] font-medium">
                        Your quote builds here
                      </p>
                      <p className="mx-auto mt-2 max-w-[15rem] text-[13px] leading-relaxed text-[var(--text-dim)]">
                        Pick a few project outcomes on the left, or add the
                        retainer — your match appears as you go.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="filled"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      <span className="mono text-[10px] uppercase tracking-[0.18em] text-[#a855f7]">
                        Your match
                      </span>

                      <p
                        aria-live="polite"
                        className="mt-2.5 text-balance text-[17px] font-semibold leading-snug tracking-tight sm:text-[18px]"
                      >
                        Looks like you&rsquo;re interested in the{" "}
                        <motion.span
                          key={lead?.id}
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="text-gradient"
                        >
                          {lead?.name}
                        </motion.span>
                        .
                      </p>

                      {/* Line items */}
                      <ul className="mt-3 space-y-2 border-t border-[var(--glass-border)] pt-3">
                        <AnimatePresence initial={false} mode="popLayout">
                          {pkg && (
                            <motion.li
                              key={pkg.id}
                              layout
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -8 }}
                              transition={{ duration: 0.32, ease }}
                              className="flex items-start justify-between gap-3"
                            >
                              <div>
                                <p className="text-[14.5px] font-medium leading-snug">
                                  {pkg.name}
                                </p>
                                <p className="mono mt-1 text-[9.5px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                                  {pkg.target}
                                </p>
                              </div>
                              <span className="mono shrink-0 rounded-md border border-[#4f6bff]/35 bg-[#4f6bff]/12 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-[#9db4ff]">
                                Project
                              </span>
                            </motion.li>
                          )}

                          {wantsRetainer && (
                            <motion.li
                              key={retainer.id}
                              layout
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -8 }}
                              transition={{ duration: 0.32, ease }}
                              className="flex items-start justify-between gap-3"
                            >
                              <div>
                                <p className="text-[14.5px] font-medium leading-snug">
                                  {retainer.name}
                                </p>
                                <p className="mono mt-1 text-[9.5px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                                  Continuous improvement
                                </p>
                              </div>
                              <span className="mono shrink-0 rounded-md border border-[#34e5b0]/35 bg-[#34e5b0]/12 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-[#34e5b0]">
                                Monthly
                              </span>
                            </motion.li>
                          )}
                        </AnimatePresence>
                      </ul>

                      {pkg && (
                        <div className="mt-3 border-t border-[var(--glass-border)] pt-3">
                          <h4 className="mono mb-2 text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                            Project scope
                          </h4>
                          <ul className="flex flex-wrap gap-1.5">
                            {pkg.includes.map((inc) => (
                              <li key={inc}>
                                <Chip tone="blue">{inc}</Chip>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <a
                        href="#contact"
                        className="group relative mt-4 block overflow-hidden rounded-xl bg-white px-6 py-2.5 text-center text-[14.5px] font-semibold text-[#04060d] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]"
                      >
                        <span className="relative z-10">Get a quote for this</span>
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      </a>

                      <p className="mt-2.5 text-center text-[12px] leading-relaxed text-[var(--text-faint)]">
                        Scoped and quoted after a free audit — no surprise scope.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </FlyIn>
        </div>
        </div>
      </div>
    </section>
  );
}
