"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { process } from "@/lib/content";

/**
 * The five-phase process, played out as one running screen instead of five
 * static cards. Same frame throughout — chart panel, status card, activity
 * feed — only the contents morph per phase, so it reads as a single demo in
 * motion rather than a slideshow. Driven by the same active/progress values
 * that scrub the cards above; falls back to its own timer loop when the
 * section isn't pinned (mobile, where usePinnedSteps never mounts a trigger).
 */

const ease = [0.16, 1, 0.3, 1] as const;
const PHASE_COUNT = 5;
const STEP_MS = 1500;

// Index-aligned with `process` in lib/content.ts: Audit, Design, Build,
// Measure, Optimize.
const ACCENTS = ["#ff5c7a", "#a855f7", "#4f6bff", "#22d3ee", "#34e5b0"];
const FILLS = [
  "rgba(255,92,122,0.16)",
  "rgba(201,164,255,0.05)",
  "rgba(79,107,255,0.22)",
  "rgba(34,211,238,0.20)",
  "rgba(52,229,176,0.22)",
];
const STATUS_VERBS = ["Scanning…", "Mapping…", "Assembling…", "Tracking…", "Tuning…"];

// Funnel taper while broken (Audit/Design), a built chart once it isn't
// (Build/Measure/Optimize) — the same five bars reused, not swapped out.
const BAR_HEIGHTS = [
  [100, 78, 55, 38, 22],
  [100, 78, 55, 38, 22],
  [55, 70, 50, 85, 65],
  [60, 80, 55, 92, 74],
  [66, 84, 60, 96, 80],
];

const LOG_LINES = [
  ["Scanning CRM for duplicate records…", "Funnel leak detected — Stage 3, 41% drop", "5 issues flagged for repair"],
  ["Mapping lead → customer journey", "Sequencing 12 workflow steps", "Build plan approved"],
  ["Deploying AI chatbot to site", "Lead scoring model trained", "Routing rules published"],
  ["Executive dashboard live", "1,204 leads tracked this month", "ROI attribution connected"],
  ["Tuning campaign #3", "CRM data health: 98%", "Monthly strategy call scheduled"],
];

const LEAK_BARS = [1, 3];
const BAR_X = [12, 64, 116, 168, 220];
const BAR_W = 38;
const BASE_Y = 128;
const MAX_H = 104;

/** The small status-card glyph. All five sit in one SVG and crossfade by opacity, so nothing shifts layout as the phase changes. */
function PhaseIcon({ phase }: { phase: number }) {
  const at = (i: number) => ({
    opacity: phase === i ? 1 : 0,
    transition: "opacity 400ms ease",
  });
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      {/* Audit — magnifier */}
      <g style={at(0)} stroke={ACCENTS[0]} strokeWidth="1.6" fill="none" strokeLinecap="round">
        <circle cx="10" cy="10" r="6" />
        <line x1="14.4" y1="14.4" x2="20" y2="20" />
      </g>
      {/* Design — layout grid */}
      <g style={at(1)} fill={ACCENTS[1]}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" opacity="0.55" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" opacity="0.55" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </g>
      {/* Build — checklist */}
      <g style={at(2)} stroke={ACCENTS[2]} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="5" height="5" rx="1" fill={ACCENTS[2]} stroke="none" />
        <path d="M4 6.5l1 1 2-2" stroke="#04060d" strokeWidth="1.1" />
        <line x1="11" y1="6.5" x2="21" y2="6.5" />
        <rect x="3" y="14" width="5" height="5" rx="1" fill={ACCENTS[2]} stroke="none" />
        <path d="M4 16.5l1 1 2-2" stroke="#04060d" strokeWidth="1.1" />
        <line x1="11" y1="16.5" x2="18" y2="16.5" />
      </g>
      {/* Measure — ascending bars */}
      <g style={at(3)} fill={ACCENTS[3]}>
        <rect x="3" y="14" width="4.5" height="7" rx="1" />
        <rect x="10" y="9" width="4.5" height="12" rx="1" />
        <rect x="17" y="3" width="4.5" height="18" rx="1" />
      </g>
      {/* Optimize — check in ring */}
      <g style={at(4)} stroke={ACCENTS[4]} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M7.5 12.5l3 3 6-7" />
      </g>
    </svg>
  );
}

export default function ProcessDemo({
  active,
  progress,
  scrubbed,
}: {
  active: number;
  progress: number;
  scrubbed: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { margin: "-15% 0px" });
  const [demoActive, setDemoActive] = useState(0);

  // Fallback loop for whenever usePinnedSteps never mounts a ScrollTrigger —
  // mobile widths, mainly. Mirrors AutomationFlow's own fallback.
  useEffect(() => {
    if (scrubbed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDemoActive(PHASE_COUNT - 1);
      return;
    }
    if (!inView) return;

    const id = window.setInterval(() => {
      setDemoActive((prev) => (prev >= PHASE_COUNT - 1 ? 0 : prev + 1));
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [scrubbed, inView]);

  const phase = scrubbed ? active : demoActive;
  const pct = scrubbed ? progress : (demoActive + 1) / PHASE_COUNT;
  const accent = ACCENTS[phase];
  const heights = BAR_HEIGHTS[phase];
  const points = BAR_X.map((x, i) => {
    const h = (heights[i] / 100) * MAX_H;
    return { x: x + BAR_W / 2, y: BASE_Y - h };
  });
  const trendPath = `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`;

  return (
    <div ref={cardRef} className="glass glass-refract sheen overflow-hidden rounded-3xl">
      {/* Fake browser chrome — the one constant frame everything plays inside. */}
      <div className="flex items-center gap-3 border-b border-[var(--glass-border)] px-4 py-2.5 sm:px-5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </span>
        <span className="mono truncate rounded-md bg-white/[0.04] px-2.5 py-1 text-[10.5px] text-[var(--text-faint)]">
          app.kingsberryconsulting.com/pipeline
        </span>
        <span className="ml-auto hidden items-center gap-1.5 sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34e5b0] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34e5b0]" />
          </span>
          <span className="mono text-[10px] uppercase tracking-[0.16em] text-[#34e5b0]">Live</span>
        </span>
      </div>

      <div className="grid items-stretch gap-3 p-3 sm:grid-cols-[1fr_auto] sm:gap-4 sm:p-4">
        {/* Chart / funnel panel — same five bars throughout. */}
        <div className="flex items-center rounded-2xl border border-[var(--glass-border)] bg-white/[0.02] p-2.5 sm:p-3">
          <svg viewBox="0 0 280 150" className="h-24 w-full sm:h-28" aria-hidden="true">
            <line x1="8" y1={BASE_Y} x2="272" y2={BASE_Y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

            {/* Blueprint plan-line: Design only. */}
            <path
              d={trendPath}
              fill="none"
              stroke="#c9a4ff"
              strokeWidth="1.4"
              strokeDasharray="4 3"
              strokeLinecap="round"
              style={{ opacity: phase === 1 ? 0.85 : 0, transition: "opacity 400ms ease" }}
            />

            {/* Trend line: Measure and Optimize. */}
            <path
              d={trendPath}
              fill="none"
              stroke={phase === 4 ? ACCENTS[4] : ACCENTS[3]}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: phase >= 3 ? 1 : 0,
                transition: "opacity 400ms ease, stroke 400ms ease",
              }}
            />
            {phase === 4 && (
              <circle cx={points[4].x} cy={points[4].y} r="3" fill={ACCENTS[4]}>
                <animate attributeName="r" values="3;5;3" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
              </circle>
            )}

            {BAR_X.map((x, i) => {
              const h = (heights[i] / 100) * MAX_H;
              const y = BASE_Y - h;
              const leaking = phase === 0 && LEAK_BARS.includes(i);
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width={BAR_W}
                    height={h}
                    rx="4"
                    fill={FILLS[phase]}
                    stroke={accent}
                    strokeWidth={phase === 1 ? 1.2 : 1}
                    strokeDasharray={phase === 1 ? "3 3" : "0"}
                    style={{
                      transition:
                        "height 550ms ease, y 550ms ease, fill 400ms ease, stroke 400ms ease",
                      transitionDelay: `${i * 35}ms`,
                    }}
                  />
                  {/* Leak mark — Audit only. */}
                  <g style={{ opacity: leaking ? 1 : 0, transition: "opacity 350ms ease" }}>
                    <line x1={x + BAR_W} y1={y + 4} x2={x + BAR_W + 12} y2={y + 4} stroke="#ff5c7a" strokeWidth="1.4" strokeDasharray="2 2" />
                    <circle cx={x + BAR_W + 14} cy={y + 4} r="2.4" fill="#ff5c7a" />
                  </g>
                  {/* Check mark — Optimize only. */}
                  <path
                    d={`M ${x + BAR_W / 2 - 5} ${y - 8} l 3.5 3.5 l 7 -7`}
                    fill="none"
                    stroke="#34e5b0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: phase === 4 ? 1 : 0, transition: "opacity 400ms ease 150ms" }}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Status card — persistent position, phase text and icon crossfade. */}
        <div className="flex flex-row items-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-white/[0.02] p-3 sm:w-48 sm:flex-col sm:items-start">
          <div className="flex items-center gap-2.5">
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border transition-colors duration-500"
              style={{ borderColor: `${accent}55`, backgroundColor: `${accent}1a` }}
            >
              <PhaseIcon phase={phase} />
            </span>
            <div>
              <p className="text-[13.5px] font-semibold leading-tight tracking-tight">
                {process[phase]?.title}
              </p>
              <p className="mono mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--text-faint)]">
                {STATUS_VERBS[phase]}
              </p>
            </div>
          </div>

          <div className="sm:mt-3 sm:border-t sm:border-[var(--glass-border)] sm:pt-3">
            <p className="mono text-[9.5px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
              Pipeline visibility
            </p>
            <p className="mono mt-0.5 text-xl font-semibold tabular-nums text-white">
              {Math.round(pct * 100)}
              <span className="text-sm text-[var(--text-faint)]">%</span>
            </p>
          </div>
        </div>

        {/* Activity feed */}
        <div className="rounded-2xl border border-[var(--glass-border)] bg-white/[0.02] p-3 sm:col-span-2">
          <div className="min-h-[56px]">
            <AnimatePresence mode="wait">
              <motion.ul
                key={phase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.32, ease }}
                className="space-y-1.5"
              >
                {LOG_LINES[phase].map((line) => (
                  <li key={line} className="flex gap-2 text-[12.5px] leading-snug text-[rgba(233,238,255,0.75)]">
                    <span className="mono text-[var(--text-faint)]" aria-hidden="true">
                      &gt;
                    </span>
                    {line}
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
