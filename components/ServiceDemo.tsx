"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";

/**
 * A small animated demo per service, shown when a service card expands.
 *
 * Each one loops through a handful of phases on a timer while it is on screen.
 * Only the expanded card mounts its demo, so at most one or two ever run.
 * Under reduced motion every demo jumps to its final phase and holds there.
 */

const ease = [0.16, 1, 0.3, 1] as const;

function useCycle(length: number, ms = 1500) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(length - 1);
      return;
    }
    const id = window.setInterval(
      () => setStep((s) => (s + 1) % length),
      ms,
    );
    return () => window.clearInterval(id);
  }, [inView, length, ms]);

  return { ref, step };
}

function Frame({
  label,
  innerRef,
  children,
}: {
  label: string;
  innerRef?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={innerRef}
      className="relative h-[186px] overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[#05080f]/70 p-4"
    >
      <span className="mono absolute right-3 top-3 z-10 text-[9px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
        {label}
      </span>
      {children}
    </div>
  );
}

/* ── 01 · AI lead generation ─────────────────────────────────────────────── */

function ChatDemo() {
  const { ref, step } = useCycle(4, 1500);

  return (
    <Frame label="Live" innerRef={ref}>
      <div className="flex h-full flex-col justify-end gap-2 pb-1">
        <AnimatePresence mode="popLayout">
          {step >= 0 && (
            <motion.div
              key="visitor"
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="ml-auto max-w-[74%] rounded-xl rounded-br-sm bg-white/[0.09] px-3 py-2 text-[12px] leading-snug"
            >
              Do you work with aerospace suppliers?
            </motion.div>
          )}
          {step >= 1 && (
            <motion.div
              key="bot"
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mr-auto max-w-[80%] rounded-xl rounded-bl-sm bg-[#4f6bff]/18 px-3 py-2 text-[12px] leading-snug text-[#cdd8ff]"
            >
              {step === 1 ? (
                <span className="flex gap-1 py-1">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-[#9db4ff]"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: d * 0.15,
                      }}
                    />
                  ))}
                </span>
              ) : (
                "We do — that's our core niche. What's your CRM today?"
              )}
            </motion.div>
          )}
          {step >= 3 && (
            <motion.div
              key="chips"
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-1.5 pt-1"
            >
              <span className="mono rounded-md border border-[#34e5b0]/35 bg-[#34e5b0]/12 px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-[#34e5b0]">
                Qualified · 87
              </span>
              <span className="mono rounded-md border border-[#4f6bff]/35 bg-[#4f6bff]/12 px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-[#9db4ff]">
                Booked · Tue 2:00
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Frame>
  );
}

/* ── 02 · Marketing automation ───────────────────────────────────────────── */

function JourneyDemo() {
  const { ref, step } = useCycle(4, 1400);
  const branch = step >= 2 ? (step === 2 ? 0 : 1) : -1;

  return (
    <Frame label="Journey" innerRef={ref}>
      <svg viewBox="0 0 260 140" className="h-full w-full">
        <defs>
          <linearGradient id="jg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4f6bff" />
            <stop offset="100%" stopColor="#34e5b0" />
          </linearGradient>
        </defs>

        {/* trunk + two branches */}
        <path d="M40 70 H105" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" fill="none" />
        <path d="M105 70 C130 70 130 34 155 34" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" fill="none" />
        <path d="M105 70 C130 70 130 106 155 106" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" fill="none" />

        {step >= 1 && (
          <motion.path
            d="M40 70 H105"
            stroke="url(#jg)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
        {branch === 0 && (
          <motion.path
            d="M105 70 C130 70 130 34 155 34"
            stroke="url(#jg)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          />
        )}
        {branch === 1 && (
          <motion.path
            d="M105 70 C130 70 130 106 155 106"
            stroke="url(#jg)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          />
        )}

        {/* nodes */}
        <g>
          <circle cx="40" cy="70" r="7" fill="#4f6bff" />
          <text x="40" y="94" textAnchor="middle" fontSize="8" fill="rgba(233,238,255,0.55)">
            Form fill
          </text>
        </g>
        <circle
          cx="105"
          cy="70"
          r="5"
          fill={step >= 1 ? "#a855f7" : "rgba(255,255,255,0.22)"}
        />
        <text x="105" y="56" textAnchor="middle" fontSize="7.5" fill="rgba(233,238,255,0.42)">
          opened?
        </text>

        <g opacity={branch === 0 ? 1 : 0.35}>
          <rect x="155" y="24" width="72" height="20" rx="5" fill="#34e5b0" fillOpacity={branch === 0 ? 0.18 : 0.06} stroke="#34e5b0" strokeOpacity={branch === 0 ? 0.5 : 0.18} />
          <text x="191" y="38" textAnchor="middle" fontSize="8.5" fill="#34e5b0">
            Book a call
          </text>
        </g>
        <g opacity={branch === 1 ? 1 : 0.35}>
          <rect x="155" y="96" width="72" height="20" rx="5" fill="#a855f7" fillOpacity={branch === 1 ? 0.18 : 0.06} stroke="#a855f7" strokeOpacity={branch === 1 ? 0.5 : 0.18} />
          <text x="191" y="110" textAnchor="middle" fontSize="8.5" fill="#c9a4ff">
            Re-send day 3
          </text>
        </g>
      </svg>
    </Frame>
  );
}

/* ── 03 · CRM cleanup ────────────────────────────────────────────────────── */

const RECORDS = [
  { name: "Apex Aero Ltd", dupe: true },
  { name: "Apex Aero Limited", dupe: true },
  { name: "Northwind Tooling", dupe: false },
  { name: "Vertex Machining", dupe: false },
];

function CrmDemo() {
  const { ref, step } = useCycle(4, 1450);
  const health = [42, 42, 71, 96][step];

  return (
    <Frame label="CRM audit" innerRef={ref}>
      <div className="flex h-full flex-col justify-between pt-4">
        <ul className="space-y-1.5">
          {RECORDS.map((r, i) => {
            const merged = step >= 2 && r.dupe && i === 1;
            const flagged = step === 1 && r.dupe;
            return (
              <motion.li
                key={r.name}
                animate={{
                  opacity: merged ? 0 : 1,
                  height: merged ? 0 : "auto",
                  marginBottom: merged ? 0 : undefined,
                }}
                transition={{ duration: 0.45, ease }}
                className="overflow-hidden"
              >
                <div
                  className={`flex items-center justify-between rounded-md border px-2.5 py-1.5 text-[11px] transition-colors duration-500 ${
                    flagged
                      ? "border-[#ff5c7a]/45 bg-[#ff5c7a]/10 text-white"
                      : "border-white/8 bg-white/[0.03] text-[var(--text-dim)]"
                  }`}
                >
                  <span>{r.name}</span>
                  {flagged && (
                    <span className="mono text-[8.5px] uppercase tracking-[0.1em] text-[#ff5c7a]">
                      Duplicate
                    </span>
                  )}
                  {step >= 3 && !r.dupe && (
                    <span className="mono text-[8.5px] uppercase tracking-[0.1em] text-[#34e5b0]">
                      Enriched
                    </span>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ul>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
              Data health
            </span>
            <span className="mono text-[11px] font-semibold tabular-nums text-white">
              {health}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#ff5c7a] via-[#a855f7] to-[#34e5b0]"
              animate={{ width: `${health}%` }}
              transition={{ duration: 0.7, ease }}
            />
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ── 04 · Customer journey ───────────────────────────────────────────────── */

const STAGES = [
  { k: "Visit", v: 100 },
  { k: "Form", v: 46 },
  { k: "MQL", v: 31 },
  { k: "SQL", v: 12 },
  { k: "Won", v: 5 },
];

function FunnelDemo() {
  const { ref, step } = useCycle(STAGES.length + 1, 1000);

  return (
    <Frame label="Funnel" innerRef={ref}>
      <div className="flex h-full items-end gap-2 pb-7 pt-6">
        {STAGES.map((s, i) => {
          const on = step > i;
          // The steepest fall between stages is where the pipeline leaks.
          const drop = i > 0 ? Math.round(100 - (s.v / STAGES[i - 1].v) * 100) : 0;
          const worst = i === 3;
          return (
            // h-full is load-bearing: the bar's height is a percentage, which
            // resolves to zero against an auto-height parent.
            <div
              key={s.k}
              className="relative flex h-full flex-1 flex-col items-center justify-end"
            >
              {worst && step > i && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mono absolute -top-6 whitespace-nowrap rounded-md border border-[#ff5c7a]/40 bg-[#ff5c7a]/12 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.08em] text-[#ff5c7a]"
                >
                  −{drop}% leak
                </motion.span>
              )}
              <motion.div
                className={`w-full rounded-t-md ${
                  worst
                    ? "bg-gradient-to-t from-[#ff5c7a]/70 to-[#ff5c7a]/25"
                    : "bg-gradient-to-t from-[#4f6bff]/70 to-[#22d3ee]/25"
                }`}
                initial={{ height: 0 }}
                animate={{ height: on ? `${s.v}%` : 0 }}
                transition={{ duration: 0.5, ease }}
              />
              <span className="mono absolute -bottom-6 text-[8.5px] uppercase tracking-[0.1em] text-[var(--text-faint)]">
                {s.k}
              </span>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

/* ── 05 · Analytics ──────────────────────────────────────────────────────── */

const BARS = [38, 55, 44, 72, 61, 88, 79];

function AnalyticsDemo() {
  const { ref, step } = useCycle(2, 2600);
  const on = step === 1;

  return (
    <Frame label="Dashboard" innerRef={ref}>
      <div className="flex h-full gap-4 pt-5">
        <div className="flex flex-col justify-between py-1">
          {[
            { k: "Leads", v: "1,284", c: "#7ea6ff" },
            { k: "Pipeline", v: "$412k", c: "#34e5b0" },
            { k: "CAC", v: "$318", c: "#c9a4ff" },
          ].map((m, i) => (
            <motion.div
              key={m.k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: on ? 1 : 0.35, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
            >
              <div className="mono text-[8.5px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                {m.k}
              </div>
              <div
                className="mono text-[15px] font-semibold tabular-nums"
                style={{ color: m.c }}
              >
                {m.v}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-1 items-end gap-1.5 pb-1">
          {BARS.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-[3px] bg-gradient-to-t from-[#4f6bff] to-[#22d3ee]"
              initial={{ height: "4%" }}
              animate={{ height: on ? `${h}%` : "4%" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease }}
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ── 06 · Content operations ─────────────────────────────────────────────── */

const OUTPUTS = ["Blog post", "LinkedIn", "Email", "Clips"];

function ContentDemo() {
  const { ref, step } = useCycle(OUTPUTS.length + 1, 900);

  return (
    <Frame label="Content engine" innerRef={ref}>
      <div className="flex h-full items-center gap-3 pt-3">
        <div className="w-[74px] shrink-0 rounded-lg border border-[#a855f7]/35 bg-[#a855f7]/10 p-2.5 text-center">
          <div className="mono text-[8px] uppercase tracking-[0.12em] text-[#c9a4ff]">
            Source
          </div>
          <div className="mt-1 text-[11px] leading-tight text-white">
            Webinar
            <br />
            recording
          </div>
        </div>

        <svg viewBox="0 0 40 120" className="h-[120px] w-8 shrink-0" preserveAspectRatio="none">
          {OUTPUTS.map((_, i) => {
            const y = 18 + i * 28;
            return (
              <path
                key={i}
                d={`M0 60 C20 60 20 ${y} 40 ${y}`}
                fill="none"
                stroke={step > i ? "#a855f7" : "rgba(255,255,255,0.14)"}
                strokeWidth="1.4"
                className="transition-colors duration-300"
              />
            );
          })}
        </svg>

        <div className="flex flex-1 flex-col gap-1.5">
          {OUTPUTS.map((o, i) => (
            <motion.div
              key={o}
              animate={{
                opacity: step > i ? 1 : 0.3,
                x: step > i ? 0 : -4,
              }}
              transition={{ duration: 0.35, ease }}
              className={`flex items-center justify-between rounded-md border px-2.5 py-1.5 text-[11px] ${
                step > i
                  ? "border-[#a855f7]/30 bg-[#a855f7]/[0.08] text-white"
                  : "border-white/8 bg-white/[0.02] text-[var(--text-faint)]"
              }`}
            >
              {o}
              {step > i && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mono text-[8.5px] uppercase text-[#34e5b0]"
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ── 07 · Local lead generation ──────────────────────────────────────────── */

function LocalDemo() {
  const { ref, step } = useCycle(4, 1300);

  return (
    <Frame label="Local presence" innerRef={ref}>
      <div className="flex h-full items-center gap-4 pt-3">
        <div className="relative grid h-[92px] w-[92px] shrink-0 place-items-center">
          <div className="absolute inset-0 rounded-xl border border-white/8 bg-[radial-gradient(circle_at_50%_50%,rgba(79,107,255,0.16),transparent_70%)]" />
          {[0, 1].map((r) => (
            <motion.span
              key={r}
              className="absolute rounded-full border border-[#4f6bff]/40"
              initial={{ width: 12, height: 12, opacity: 0.8 }}
              animate={{ width: 88, height: 88, opacity: 0 }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: r * 1.1,
                ease: "easeOut",
              }}
            />
          ))}
          <motion.svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="relative"
          >
            <path
              d="M12 22s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"
              fill="#4f6bff"
            />
            <circle cx="12" cy="10.6" r="2.6" fill="#04060d" />
          </motion.svg>
        </div>

        <div className="flex-1">
          <div className="mono text-[8.5px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
            Reviews
          </div>
          <div className="mt-1.5 flex gap-1">
            {[0, 1, 2, 3, 4].map((s) => (
              <motion.svg
                key={s}
                width="15"
                height="15"
                viewBox="0 0 24 24"
                animate={{
                  fill: step >= 1 ? "#f5c451" : "rgba(255,255,255,0.14)",
                  scale: step >= 1 ? 1 : 0.85,
                }}
                transition={{ delay: s * 0.09, duration: 0.3 }}
              >
                <path d="M12 2l2.9 6.3 6.8.8-5 4.7 1.3 6.8L12 17.4 6 20.6l1.3-6.8-5-4.7 6.8-.8z" />
              </motion.svg>
            ))}
          </div>

          <AnimatePresence>
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 rounded-md border border-[#34e5b0]/35 bg-[#34e5b0]/10 px-2.5 py-1.5"
              >
                <div className="mono text-[8px] uppercase tracking-[0.12em] text-[#34e5b0]">
                  Appointment booked
                </div>
                <div className="mt-0.5 text-[11px] text-white">
                  Thu · 9:30 AM · Auto-confirmed
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Frame>
  );
}

/* ── 08 · Customer experience ────────────────────────────────────────────── */

function NpsDemo() {
  const { ref, step } = useCycle(2, 2600);
  const on = step === 1;
  const score = on ? 62 : 0;
  // Semicircle sweep: -100 → +100 maps onto a 180° arc.
  const pct = (score + 100) / 200;
  const ARC = 126; // path length of the gauge arc, in user units

  return (
    <Frame label="Voice of Customer" innerRef={ref}>
      <div className="flex h-full items-center gap-5 pt-3">
        <div className="relative w-[118px] shrink-0">
          <svg viewBox="0 0 100 56" className="w-full">
            <path
              d="M8 50 A42 42 0 0 1 92 50"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <motion.path
              d="M8 50 A42 42 0 0 1 92 50"
              fill="none"
              stroke="#34e5b0"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={ARC}
              initial={{ strokeDashoffset: ARC }}
              animate={{ strokeDashoffset: ARC - ARC * pct }}
              transition={{ duration: 1.1, ease }}
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 text-center">
            <div className="mono text-[20px] font-semibold tabular-nums text-white">
              {score > 0 ? `+${score}` : "—"}
            </div>
            <div className="mono text-[8px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
              NPS
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {[
            { k: "Promoters", v: 71, c: "#34e5b0" },
            { k: "Passives", v: 20, c: "#7ea6ff" },
            { k: "Detractors", v: 9, c: "#ff5c7a" },
          ].map((b, i) => (
            <div key={b.k}>
              <div className="mb-1 flex justify-between">
                <span className="mono text-[8.5px] uppercase tracking-[0.12em] text-[var(--text-faint)]">
                  {b.k}
                </span>
                <span className="mono text-[9px] tabular-nums" style={{ color: b.c }}>
                  {on ? `${b.v}%` : "—"}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: b.c }}
                  initial={{ width: 0 }}
                  animate={{ width: on ? `${b.v}%` : 0 }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ── dispatch ────────────────────────────────────────────────────────────── */

const DEMOS: Record<string, () => React.JSX.Element> = {
  "ai-lead-gen": ChatDemo,
  "marketing-automation": JourneyDemo,
  crm: CrmDemo,
  journey: FunnelDemo,
  analytics: AnalyticsDemo,
  "content-ops": ContentDemo,
  local: LocalDemo,
  cx: NpsDemo,
};

export default function ServiceDemo({ id }: { id: string }) {
  const Demo = DEMOS[id];
  if (!Demo) return null;
  return <Demo />;
}
