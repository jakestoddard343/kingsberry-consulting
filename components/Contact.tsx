"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { site } from "@/lib/content";
import { useQuote } from "./QuoteProvider";
import { RevealWords } from "./Reveal";
import { usePinnedSteps } from "@/lib/use-pinned-steps";
import { usePeak, useFlyIn, useLandedOnce } from "@/lib/use-fly-in";
import FlyIn from "./FlyIn";

const interests = [
  "AI lead generation",
  "Marketing automation",
  "CRM / Salesforce",
  "Analytics & reporting",
  "Not sure yet",
];

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mono mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
        {label}
        {required && <span className="ml-1 text-[#7ea6ff]">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--glass-border)] bg-white/[0.035] px-4 py-2.5 text-[15px] text-white outline-none transition-all duration-300 placeholder:text-[rgba(233,238,255,0.25)] focus:border-[#4f6bff]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#4f6bff]/25"
      />
    </label>
  );
}

export default function Contact() {
  const { summary } = useQuote();
  const [interest, setInterest] = useState(interests[0]);
  const [sent, setSent] = useState(false);

  // Anything picked upstairs answers this question already; asking again is
  // the fastest way to lose a form that was most of the way filled in.
  const fromPicker = summary.length > 0;

  // TODO: wire this to a real endpoint (Formspree, HubSpot Forms, or an API route).
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  // Shortest pin on the page — this is the conversion point, and the less
  // time its inputs spend inside a pinned (position: fixed) box, the less
  // there is to go wrong (see the Tab-focus check in the verification pass).
  const { sectionRef, pinRef, progressMV, scrubbed } = usePinnedSteps(1, {
    stepVh: 60,
    tailVh: 15,
  });
  const peak = usePeak(progressMV);
  const leftFly = useFlyIn(peak, { from: 0, to: 0.5, x: -200 });
  // No rotateY here (unlike Services/Packages): keeping this card's fly-in
  // to a plain 2D slide is one less thing for the inert guard below to
  // reason about, even though — see leftLanded/cardLanded — the guard turned
  // out to be doing the real work regardless of transform type.
  const cardFly = useFlyIn(peak, { from: 0.18, to: 0.68, x: 200 });

  // A focusable field mid-flight (still offset, still fading in) is exactly
  // what makes a browser's focus-into-view heuristic yank the real scroll
  // position out from under GSAP's pin — confirmed by testing: Tab-ing
  // through fields while the card is still animating jumped the page and
  // dropped the pin, while Tab-ing once it's at rest was inert (no pun
  // intended). `inert` keeps each column entirely out of the tab order and
  // the accessibility tree — correct anyway for content that hasn't
  // visually arrived — until its own fly-in has landed.
  const leftLanded = useLandedOnce(peak, 0.5 * 0.9);
  const cardLanded = useLandedOnce(peak, 0.18 + (0.68 - 0.18) * 0.9);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative border-t border-[var(--glass-border)]"
    >
      {/* pt-24 clears the nav's 112px blur scrim (h-28) — see RevenueMachine's
          equivalent note; short of that the eyebrow/heading render washed
          out underneath it for the whole time the section is pinned. */}
      <div
        ref={pinRef}
        className="relative overflow-hidden px-5 pb-14 pt-24 sm:px-6 sm:pt-24 lg:pb-10 lg:pt-24"
      >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 110%, rgba(79,107,255,0.26) 0%, transparent 68%)," +
            "radial-gradient(50% 40% at 15% 0%, rgba(34,211,238,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
          <FlyIn style={scrubbed ? leftFly : undefined}>
            <div inert={scrubbed && !leftLanded ? true : undefined}>
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#22d3ee]">
              Start here
            </span>
            <h2 className="mt-3 text-balance text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[2.2rem]">
              <RevealWords text="Get a free lead-funnel audit." />
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--text-dim)]">
              Tell us where leads come from today. We&rsquo;ll map your funnel,
              find the leaks, and send back a prioritized fix list — no charge,
              no obligation.
            </p>

            <ul className="mt-6 space-y-2.5">
              {[
                "A written audit of your current funnel",
                "The three highest-impact automations to build first",
                "A realistic estimate of what each one recovers",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[14px]">
                  <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[#34e5b0]" />
                  <span className="text-[rgba(233,238,255,0.78)]">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-1.5 border-t border-[var(--glass-border)] pt-5">
              <a
                href={`mailto:${site.email}`}
                className="block text-[14.5px] text-white transition-colors hover:text-[#7ea6ff]"
              >
                {site.email}
              </a>
              <a
                href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                className="mono block text-[14.5px] text-[var(--text-dim)] transition-colors hover:text-white"
              >
                {site.phone}
              </a>
              <p className="mono pt-1 text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                {site.location}
              </p>
            </div>
            </div>
          </FlyIn>

          <FlyIn style={scrubbed ? cardFly : undefined}>
            <div
              inert={scrubbed && !cardLanded ? true : undefined}
              className="glass glass-refract sheen rounded-3xl p-5 sm:p-6"
            >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex min-h-[340px] flex-col items-center justify-center text-center"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#34e5b0]/15 text-[#34e5b0]">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path
                        d="M4 11.5l4.5 4.5L18 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">
                    Request received
                  </h3>
                  <p className="mt-2.5 max-w-xs text-[14.5px] leading-relaxed text-[var(--text-dim)]">
                    We&rsquo;ll be in touch within one business day with next
                    steps for your audit.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Name" name="name" required placeholder="Jane Doe" />
                    <Field
                      label="Company"
                      name="company"
                      placeholder="Acme Manufacturing"
                    />
                  </div>
                  <Field
                    label="Work email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@acme.com"
                  />
                  <Field
                    label="Current CRM"
                    name="crm"
                    placeholder="Salesforce, HubSpot, spreadsheets…"
                  />

                  <div>
                    <span className="mono mb-2 block text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                      What do you need help with?
                    </span>

                    {fromPicker ? (
                      <div>
                        <motion.ul
                          layout
                          className="flex max-h-[92px] flex-wrap gap-1.5 overflow-y-auto"
                        >
                          <AnimatePresence initial={false}>
                            {summary.map((label) => (
                              <motion.li
                                key={label}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.24 }}
                                className="rounded-xl border border-[#4f6bff]/45 bg-[#4f6bff]/16 px-3 py-1.5 text-[12.5px] text-white"
                              >
                                {label}
                              </motion.li>
                            ))}
                          </AnimatePresence>
                        </motion.ul>
                        <p className="mt-2.5 text-[12px] text-[var(--text-faint)]">
                          Carried over from your quote.{" "}
                          <a
                            href="#packages"
                            className="underline underline-offset-2 transition-colors hover:text-white"
                          >
                            Change it
                          </a>
                        </p>
                        <input
                          type="hidden"
                          name="interest"
                          value={summary.join(", ")}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setInterest(opt)}
                              aria-pressed={interest === opt}
                              className={`rounded-xl border px-3.5 py-2 text-[13px] transition-all duration-300 ${
                                interest === opt
                                  ? "border-[#4f6bff]/60 bg-[#4f6bff]/18 text-white"
                                  : "border-[var(--glass-border)] text-[var(--text-dim)] hover:border-white/25 hover:text-white"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        <input type="hidden" name="interest" value={interest} />
                      </>
                    )}
                  </div>

                  <label className="block">
                    <span className="mono mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                      Anything else?
                    </span>
                    <textarea
                      name="message"
                      rows={2}
                      placeholder="Where do most of your leads come from today?"
                      className="w-full resize-none rounded-xl border border-[var(--glass-border)] bg-white/[0.035] px-4 py-2.5 text-[15px] text-white outline-none transition-all duration-300 placeholder:text-[rgba(233,238,255,0.25)] focus:border-[#4f6bff]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#4f6bff]/25"
                    />
                  </label>

                  <button
                    type="submit"
                    className="group relative w-full overflow-hidden rounded-xl bg-white px-6 py-3 text-[15px] font-semibold text-[#04060d] transition-transform duration-300 hover:scale-[1.015] active:scale-[0.99]"
                  >
                    <span className="relative z-10">Request my free audit</span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>

                  <p className="text-center text-[12px] leading-relaxed text-[var(--text-faint)]">
                    No spam, no drip sequence you didn&rsquo;t ask for. Just the
                    audit.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
            </div>
          </FlyIn>
        </div>
        </div>
      </div>
    </section>
  );
}
