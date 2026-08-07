"use client";

import { useEffect, useState } from "react";
import { motion, useTransform, useSpring, type MotionValue } from "motion/react";

/**
 * A funnel that drains as the reader scrolls the failure list.
 *
 * 100 leads enter the top; each stage siphons a share out through the side
 * cracks, and the survivors counter at the bottom falls in step with scroll.
 */

// SVG user-space geometry. The container is locked to this aspect ratio so the
// HTML stage labels can be positioned by percentage without drifting.
const VW = 320;
const VH = 400;
const CX = VW / 2;
const TOP_Y = 14;
const BOT_Y = 336;
const TOP_HALF = 150;
const BOT_HALF = 42;

/** Half-width of the funnel at a given height. */
const halfAt = (y: number) =>
  TOP_HALF - ((y - TOP_Y) / (BOT_Y - TOP_Y)) * (TOP_HALF - BOT_HALF);

const STAGES = [
  { y: 78, label: "Captured" },
  { y: 148, label: "Followed up" },
  { y: 218, label: "Qualified" },
  { y: 288, label: "Routed" },
];

// Falling particles inside the funnel. Deterministic so SSR and the client
// render identical markup.
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  x: CX - 120 + ((i * 71) % 240),
  delay: (i * 0.37) % 5,
  dur: 3.4 + ((i * 13) % 24) / 10,
}));

function Leak({
  y,
  side,
  progress,
  threshold,
}: {
  y: number;
  side: -1 | 1;
  progress: MotionValue<number>;
  threshold: number;
}) {
  // Start at the funnel wall for this height, then push outward.
  const wallX = CX + side * halfAt(y);

  const opacity = useTransform(
    progress,
    [threshold - 0.08, threshold + 0.06],
    [0, 1],
  );
  const tipX = useTransform(
    progress,
    [threshold - 0.08, threshold + 0.16],
    [wallX, wallX + side * 42],
  );

  return (
    <motion.g style={{ opacity }}>
      <motion.line
        x1={wallX}
        y1={y}
        x2={tipX}
        y2={y}
        stroke="#ff5c7a"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
      <motion.circle cx={tipX} cy={y} r={3} fill="#ff5c7a">
        <animate
          attributeName="opacity"
          values="1;0.15;1"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </motion.circle>
    </motion.g>
  );
}

export default function LeakyFunnel({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const [survivors, setSurvivors] = useState(100);

  const smooth = useSpring(progress, { stiffness: 90, damping: 24, mass: 0.6 });
  const remaining = useTransform(smooth, [0, 0.92], [100, 11]);

  useEffect(
    () => remaining.on("change", (v) => setSurvivors(Math.max(11, Math.round(v)))),
    [remaining],
  );

  const bodyPath = `M ${CX - TOP_HALF} ${TOP_Y} L ${CX + TOP_HALF} ${TOP_Y} L ${
    CX + BOT_HALF
  } ${BOT_Y} L ${CX - BOT_HALF} ${BOT_Y} Z`;

  return (
    <div className="relative">
      <div className="relative w-full" style={{ aspectRatio: `${VW} / ${VH}` }}>
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-label="Funnel diagram showing leads lost at each stage"
          role="img"
        >
          <defs>
            <linearGradient id="funnelFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f6bff" stopOpacity="0.32" />
              <stop offset="55%" stopColor="#a855f7" stopOpacity="0.17" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="funnelStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9db4ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" />
            </linearGradient>
            <clipPath id="funnelClip">
              <path d={bodyPath} />
            </clipPath>
          </defs>

          <path
            d={bodyPath}
            fill="url(#funnelFill)"
            stroke="url(#funnelStroke)"
            strokeWidth="1.4"
          />

          {/* Falling leads */}
          <g clipPath="url(#funnelClip)">
            {PARTICLES.map((p, i) => (
              <circle key={i} cx={p.x} cy={0} r={2} fill="#cdd8ff" opacity={0.7}>
                <animate
                  attributeName="cy"
                  values={`${TOP_Y};${BOT_Y}`}
                  dur={`${p.dur}s`}
                  begin={`${p.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.75;0.75;0"
                  dur={`${p.dur}s`}
                  begin={`${p.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>

          {/* Stage rules and their leaks */}
          {STAGES.map((s, i) => {
            const half = halfAt(s.y);
            return (
              <g key={s.label}>
                <line
                  x1={CX - half}
                  y1={s.y}
                  x2={CX + half}
                  y2={s.y}
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="0.9"
                />
                <Leak
                  y={s.y}
                  side={-1}
                  progress={smooth}
                  threshold={i / STAGES.length}
                />
                <Leak
                  y={s.y}
                  side={1}
                  progress={smooth}
                  threshold={i / STAGES.length}
                />
              </g>
            );
          })}

          {/* Outlet */}
          <line
            x1={CX - BOT_HALF}
            y1={BOT_Y}
            x2={CX + BOT_HALF}
            y2={BOT_Y}
            stroke="#34e5b0"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>

        {/* Stage labels sit in HTML so the type stays crisp and unscaled. They
            ride just above each divider, inside the funnel, clear of the leaks. */}
        <div className="pointer-events-none absolute inset-0">
          {STAGES.map((s) => (
            <span
              key={s.label}
              className="mono absolute left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap pb-1.5 text-[9.5px] uppercase tracking-[0.16em] text-[rgba(233,238,255,0.5)]"
              style={{ top: `${(s.y / VH) * 100}%` }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-[var(--glass-border)] pt-5">
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Reaching sales
          </div>
          <div className="mono mt-1 text-4xl font-semibold tabular-nums text-[#ff5c7a]">
            {survivors}
            <span className="ml-1 text-lg text-[var(--text-faint)]">/ 100</span>
          </div>
        </div>
        <p className="max-w-[11rem] text-right text-[11px] leading-snug text-[var(--text-faint)]">
          Typical B2B funnel without automation.
        </p>
      </div>
    </div>
  );
}
