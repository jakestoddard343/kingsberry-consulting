"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { credibility } from "@/lib/content";

/**
 * An exploded axonometric machine: seven stacked plates, pulled apart along
 * their own stack axis, converging into one assembled unit as `peak`
 * advances. Four of the plates carry a leader line out to one of the
 * `credibility` items — the same content the section used to show as plain
 * cards, now wired directly to the layer of the machine it describes.
 *
 * Geometry is precomputed in plain numbers (it never changes); only the
 * interpolation between exploded and rest position is scroll-driven.
 */

const ACCENTS = ["", "", "", "#4f6bff", "#a855f7", "#22d3ee", "#34e5b0"] as const;
const OFF = "rgba(233,238,255,0.35)";

// Math.cos/Math.sin can differ by a few ULPs between the server's Node/V8
// and the browser's Chromium/V8 — enough for React's hydration check to flag
// a mismatch on the resulting attribute string, even though nothing is
// visually different. Rounding every trig-derived coordinate to a stable
// precision removes the platform-dependent tail digits entirely.
const r = (n: number) => Math.round(n * 1000) / 1000;

// Stack axis: base (widest, "sources") to top (narrowest, "dashboard").
const BASE = { x: 170, y: 410 };
const TOP = { x: 280, y: 60 };
const AXIS_LEN = Math.hypot(TOP.x - BASE.x, TOP.y - BASE.y);
const AXIS = { x: (TOP.x - BASE.x) / AXIS_LEN, y: (TOP.y - BASE.y) / AXIS_LEN };
const MID = 3; // "score" — the plate that barely moves when exploded.
const EXPLODE_UNIT = 36;

const PLATE_COUNT = 7;
const round3 = (n: number) => Math.round(n * 1000) / 1000;
const REST = Array.from({ length: PLATE_COUNT }, (_, i) => ({
  x: round3(BASE.x + (TOP.x - BASE.x) * (i / (PLATE_COUNT - 1))),
  y: round3(BASE.y + (TOP.y - BASE.y) * (i / (PLATE_COUNT - 1))),
}));
const EXPLODED = REST.map((rest, i) => ({
  x: round3(rest.x + AXIS.x * (i - MID) * EXPLODE_UNIT),
  y: round3(rest.y + AXIS.y * (i - MID) * EXPLODE_UNIT),
}));
const RX = Array.from({ length: PLATE_COUNT }, (_, i) => round3(96 - 40 * (i / (PLATE_COUNT - 1))));
const RY = RX.map((rx) => round3(rx * 0.34));
const WALL_H = 15;

const LABELS = ["sources", "crm", "hygiene", "score", "route", "attribute", "dashboard"];
// The viewBox is wider than the machine itself (which sits in x:0-400) so
// leader lines have somewhere to go and labels have real room — roughly a
// 60/40 split between the machine and the label column.
const VIEW_W = 700;
const VIEW_H = 480;
const LEADER_END_X = 480; // world x every leader line reaches for.
const LEADER_LEN = 200; // generous — dash draws in over more than the true length so it never looks clipped.
// The four plates that carry a callout sit only ~58 units apart — nowhere
// near enough room for a 3-line label without them overlapping. Labels get
// their own generously-spaced column; the leader line's job is to cover the
// resulting gap between where the plate actually is and where its label sits.
const LABEL_Y = [340, 240, 140, 40];

/** The bottom-half "skirt" of an axonometric disc, drawn in the plate's own
 * local space (origin at the top face's center) so the wrapping <motion.g>
 * can move the whole plate with a single x/y translate. */
function Skirt({ rx, ry, fill, stroke }: { rx: number; ry: number; fill: string; stroke: string }) {
  return (
    <path
      d={`M ${-rx} 0 L ${-rx} ${WALL_H} A ${rx} ${ry} 0 0 1 ${rx} ${WALL_H} L ${rx} 0 Z`}
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
    />
  );
}

/** Per-plate rim motif — what makes each layer read as doing something
 * different, not just "ring, but smaller." All drawn in local space. */
function Motif({ index, rx, ry }: { index: number; rx: number; ry: number }) {
  const accent = ACCENTS[index] || OFF;
  switch (index) {
    case 0: // sources — inlet ports around the base rim
      return (
        <g>
          {[-0.6, -0.3, 0, 0.3, 0.6].map((t, i) => (
            <rect key={i} x={rx * t - 4} y={-3} width={8} height={6} rx={1.5} fill={OFF} />
          ))}
        </g>
      );
    case 1: // crm — record slots, like a card rack
      return (
        <g stroke={OFF} strokeWidth={1.2}>
          <line x1={-rx * 0.55} y1={-6} x2={rx * 0.55} y2={-6} />
          <line x1={-rx * 0.55} y1={0} x2={rx * 0.55} y2={0} />
          <line x1={-rx * 0.55} y1={6} x2={rx * 0.55} y2={6} />
        </g>
      );
    case 2: // hygiene — a fine filter mesh ring inset from the rim
      return (
        <ellipse
          cx={0}
          cy={0}
          rx={rx * 0.62}
          ry={ry * 0.62}
          fill="none"
          stroke={OFF}
          strokeWidth={1}
          strokeDasharray="2 3"
        />
      );
    case 3: // score — a gear ring, the one layer that idles a slow spin
      return (
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const x = r(Math.cos(a) * rx * 0.82);
            const y = r(Math.sin(a) * ry * 0.82);
            return <rect key={i} x={r(x - 3)} y={r(y - 3)} width={6} height={6} fill={accent} />;
          })}
          <circle cx={0} cy={0} r={rx * 0.32} fill="none" stroke={accent} strokeWidth={1.4} />
        </motion.g>
      );
    case 4: // route — radial distributor spokes
      return (
        <g stroke={accent} strokeWidth={1.3}>
          {[-1, -0.5, 0, 0.5, 1].map((t, i) => (
            <line key={i} x1={0} y1={0} x2={rx * 0.85 * t} y2={ry * 0.85 * (t === 0 ? -1 : t * 0.3 - 0.5)} />
          ))}
          <circle cx={0} cy={0} r={4} fill={accent} />
        </g>
      );
    case 5: // attribute — a dial ring with tick marks
      return (
        <g>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const x1 = r(Math.cos(a) * rx * 0.6);
            const y1 = r(Math.sin(a) * ry * 0.6);
            const x2 = r(Math.cos(a) * rx * 0.78);
            const y2 = r(Math.sin(a) * ry * 0.78);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth={1.4} />;
          })}
        </g>
      );
    case 6: // dashboard — small bars on the top face, gently breathing
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={-18 + i * 14}
              y={-2}
              width={9}
              height={10}
              fill={accent}
              opacity={0.85}
            >
              <animate
                attributeName="height"
                values={`${8 + i * 3};${14 + i * 2};${8 + i * 3}`}
                dur={`${2.6 + i * 0.4}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                values={`${-1 - i * 1.5};${-4 - i};${-1 - i * 1.5}`}
                dur={`${2.6 + i * 0.4}s`}
                repeatCount="indefinite"
              />
            </rect>
          ))}
        </g>
      );
    default:
      return null;
  }
}

/** One plate's scroll-driven state, unrolled at a fixed arity (Rules of
 * Hooks — see Services.tsx for the identical pattern with card fly-ins). */
function usePlate(peak: MotionValue<number>, i: number) {
  const from = i * 0.1;
  const to = from + 0.35;
  const local = useTransform(peak, [from, to], [0, 1]);
  const x = useTransform(local, [0, 1], [EXPLODED[i].x, REST[i].x]);
  const y = useTransform(local, [0, 1], [EXPLODED[i].y, REST[i].y]);
  const opacity = useTransform(local, [0, 0.35], [0, 1]);
  // Leader lines only draw in once their plate is nearly home — by then it
  // reads as "arrived," so anchoring the line at the rest position (rather
  // than tracking the plate mid-flight) doesn't show.
  const dash = useTransform(local, [0.55, 1], [LEADER_LEN, 0]);
  return { x, y, opacity, dash };
}

function Particles() {
  const dots = Array.from({ length: 7 }, (_, i) => ({
    delay: (i * 0.63) % 4.4,
    dur: 3.6 + ((i * 11) % 20) / 10,
    off: ((i * 37) % 100) / 100 - 0.5,
  }));
  return (
    <g clipPath="url(#machineClip)">
      {dots.map((d, i) => (
        <circle key={i} r={2} fill="#7ea6ff" opacity={0}>
          <animateMotion
            path={`M ${BASE.x + d.off * 14} ${BASE.y} L ${TOP.x + d.off * 14} ${TOP.y}`}
            dur={`${d.dur}s`}
            begin={`${d.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0.8;0"
            dur={`${d.dur}s`}
            begin={`${d.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
}

export default function RevenueMachine({
  peak,
  scrubbed,
}: {
  peak: MotionValue<number>;
  scrubbed: boolean;
}) {
  // Rules of Hooks needs a fixed call order, so all seven plates are
  // unrolled rather than called inside the render map below.
  const plates = [
    usePlate(peak, 0),
    usePlate(peak, 1),
    usePlate(peak, 2),
    usePlate(peak, 3),
    usePlate(peak, 4),
    usePlate(peak, 5),
    usePlate(peak, 6),
  ];

  // credibility[0..3] maps onto the four accented plates (score, route,
  // attribute, dashboard) in stack order — each layer of the finished
  // machine gets one line of the site's actual credibility copy.
  const calloutPlates = [3, 4, 5, 6];

  // Same fixed-arity constraint as the plates above — four explicit calls
  // rather than one inside the labels' .map() below.
  const labelOpacities = [
    useTransform(plates[3].dash, [LEADER_LEN, 0], [0, 1]),
    useTransform(plates[4].dash, [LEADER_LEN, 0], [0, 1]),
    useTransform(plates[5].dash, [LEADER_LEN, 0], [0, 1]),
    useTransform(plates[6].dash, [LEADER_LEN, 0], [0, 1]),
  ];

  return (
    // Sized to fit by construction: width tracks the column, but a height
    // cap means it can never make the pinned panel taller than the viewport
    // no matter how wide that column gets — beyond the cap it just
    // letterboxes slightly rather than growing further.
    <div
      className="relative mx-auto w-full max-h-[42svh]"
      style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="machineClip">
            <rect x="0" y="-40" width="400" height="560" />
          </clipPath>
        </defs>

        <Particles />

        {plates.map((p, i) => (
          <motion.g
            key={LABELS[i]}
            style={{
              x: scrubbed ? p.x : REST[i].x,
              y: scrubbed ? p.y : REST[i].y,
              opacity: scrubbed ? p.opacity : 1,
            }}
          >
            <Skirt rx={RX[i]} ry={RY[i]} fill="rgba(255,255,255,0.025)" stroke={OFF} />
            <ellipse
              cx={0}
              cy={0}
              rx={RX[i]}
              ry={RY[i]}
              fill="rgba(4,6,13,0.55)"
              stroke={i >= 3 ? ACCENTS[i] : OFF}
              strokeWidth={1.3}
            />
            <Motif index={i} rx={RX[i]} ry={RY[i]} />
          </motion.g>
        ))}

        {/* Leader lines — anchored at each accented plate's rest-position
            rim, drawn in as that plate lands, angling to its label's slot. */}
        {calloutPlates.map((i, ci) => {
          const rim = { x: REST[i].x + RX[i], y: REST[i].y };
          const path = `M ${rim.x} ${rim.y} L ${LEADER_END_X} ${LABEL_Y[ci]}`;
          return (
            <motion.path
              key={i}
              d={path}
              fill="none"
              stroke={ACCENTS[i]}
              strokeWidth={1.2}
              strokeDasharray={LEADER_LEN}
              style={{ strokeDashoffset: scrubbed ? plates[i].dash : 0 }}
            />
          );
        })}
      </svg>

      {/* Labels ride in HTML, positioned by percentage against the same
          viewBox — crisp text instead of scaled SVG glyphs (LeakyFunnel.tsx
          uses the same technique for its stage labels). */}
      <div className="pointer-events-none absolute inset-0">
        {calloutPlates.map((i, ci) => {
          const item = credibility[ci];
          if (!item) return null;
          const leftPct = (LEADER_END_X / VIEW_W) * 100;
          const topPct = (LABEL_Y[ci] / VIEW_H) * 100;
          return (
            <motion.div
              key={i}
              className="absolute max-w-[9.5rem] -translate-y-1/2 pl-2"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                opacity: scrubbed ? labelOpacities[ci] : 1,
              }}
            >
              <p
                className="mono text-[9px] uppercase tracking-[0.16em]"
                style={{ color: ACCENTS[i] }}
              >
                {item.k}
              </p>
              <h4 className="mt-0.5 text-[12.5px] font-semibold leading-snug tracking-tight text-white">
                {item.v}
              </h4>
              <p className="mt-1 text-[10.5px] leading-snug text-[var(--text-faint)]">
                {item.note}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
